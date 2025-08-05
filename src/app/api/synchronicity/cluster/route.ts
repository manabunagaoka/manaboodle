// app/api/synchronicity/cluster/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Matrix } from 'ml-matrix';
import OpenAI from 'openai';
const nlp = require('compromise');

interface DataPoint {
  id: string;
  content: string;
  name?: string;
  type?: string;
}

interface Cluster {
  id: number;
  data_points: DataPoint[];
  summary: string;
  similarity_score: number;
  centroid: number[];
}

interface ClusterRequest {
  data_points: string[] | DataPoint[];
  num_clusters?: number;
}

interface ClusterResponse {
  clusters: Cluster[];
  metadata: {
    total_points: number;
    processing_time: number;
    algorithm: string;
  };
}

// Text preprocessing function
function preprocessText(text: string): string {
  // Basic text cleaning
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Simple word embedding using word frequency vectors
function textToVector(text: string, vocabulary: string[]): number[] {
  const processed = preprocessText(text);
  const words = processed.split(' ');
  const vector = new Array(vocabulary.length).fill(0);
  
  // Count word frequencies
  words.forEach(word => {
    const index = vocabulary.indexOf(word);
    if (index !== -1) {
      vector[index]++;
    }
  });
  
  // Normalize vector
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? vector.map(val => val / magnitude) : vector;
}

// Build vocabulary from all texts
function buildVocabulary(texts: string[]): string[] {
  const wordCount = new Map<string, number>();
  
  texts.forEach(text => {
    const processed = preprocessText(text);
    const words = processed.split(' ');
    words.forEach(word => {
      if (word.length > 2) { // Filter out very short words
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      }
    });
  });
  
  // Return top 100 most frequent words
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)
    .map(([word]) => word);
}

// K-means clustering implementation
function kmeansClustering(vectors: number[][], k: number, maxIterations = 100): number[] {
  const numPoints = vectors.length;
  const dimensions = vectors[0].length;
  
  if (numPoints <= k) {
    // If we have fewer points than clusters, each point is its own cluster
    return vectors.map((_, i) => i);
  }
  
  // Initialize centroids randomly
  const centroids: number[][] = [];
  for (let i = 0; i < k; i++) {
    centroids.push(vectors[Math.floor(Math.random() * numPoints)].slice());
  }
  
  let assignments = new Array(numPoints).fill(0);
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const newAssignments = new Array(numPoints);
    
    // Assign each point to nearest centroid
    for (let i = 0; i < numPoints; i++) {
      let minDistance = Infinity;
      let bestCluster = 0;
      
      for (let j = 0; j < k; j++) {
        const distance = euclideanDistance(vectors[i], centroids[j]);
        if (distance < minDistance) {
          minDistance = distance;
          bestCluster = j;
        }
      }
      
      newAssignments[i] = bestCluster;
    }
    
    // Check for convergence
    if (JSON.stringify(assignments) === JSON.stringify(newAssignments)) {
      break;
    }
    
    assignments = newAssignments;
    
    // Update centroids
    for (let j = 0; j < k; j++) {
      const clusterPoints = vectors.filter((_, i) => assignments[i] === j);
      if (clusterPoints.length > 0) {
        for (let d = 0; d < dimensions; d++) {
          centroids[j][d] = clusterPoints.reduce((sum, point) => sum + point[d], 0) / clusterPoints.length;
        }
      }
    }
  }
  
  return assignments;
}

// Calculate euclidean distance between two vectors
function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

// Generate cluster summary using AI
async function generateClusterSummary(texts: string[]): Promise<string> {
  if (texts.length === 0) return "Empty cluster";
  
  // Fallback to local NLP if no OpenAI key
  if (!process.env.OPENAI_API_KEY) {
    const allText = texts.join(' ');
    const doc = nlp(allText);
    const nouns = doc.nouns().out('array').slice(0, 3);
    const adjectives = doc.adjectives().out('array').slice(0, 2);
    
    if (nouns.length > 0) {
      return `Cluster focused on ${nouns.join(', ')}${adjectives.length > 0 ? ` with ${adjectives.join(', ')} characteristics` : ''}`;
    }
    return `Cluster of ${texts.length} similar items`;
  }

  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // AI-powered summary
    const prompt = `Analyze these responses and provide a concise business insight about this customer segment or pattern:

${texts.join('\n\n')}

Provide a 1-2 sentence summary that identifies the main theme and business opportunity. Be specific and actionable.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.7
    });

    return response.choices[0].message.content || `Cluster of ${texts.length} similar items`;
  } catch (error) {
    console.error('OpenAI error:', error);
    // Fallback to local processing
    return `Cluster of ${texts.length} items with similar patterns`;
  }
}

// Calculate cluster similarity score
function calculateSimilarityScore(vectors: number[][], centroid: number[]): number {
  if (vectors.length === 0) return 0;
  
  const distances = vectors.map(vector => euclideanDistance(vector, centroid));
  const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
  
  // Convert distance to similarity score (0-1, higher is more similar)
  return Math.max(0, 1 - avgDistance);
}

export async function POST(req: NextRequest): Promise<NextResponse<ClusterResponse | { error: string }>> {
  const startTime = Date.now();
  
  try {
    const body: ClusterRequest = await req.json();
    const { data_points, num_clusters } = body;
    
    // Validate input
    if (!data_points || !Array.isArray(data_points) || data_points.length === 0) {
      return NextResponse.json(
        { error: 'data_points must be a non-empty array' },
        { status: 400 }
      );
    }
    
    // Convert input to standardized format
    const standardizedPoints: DataPoint[] = data_points.map((point, index) => {
      if (typeof point === 'string') {
        return {
          id: `point_${index}`,
          content: point,
          type: 'text'
        };
      } else {
        return {
          id: point.id || `point_${index}`,
          content: point.content,
          name: point.name,
          type: point.type || 'text'
        };
      }
    });
    
    // Extract text content for processing
    const texts = standardizedPoints.map(point => point.content);
    
    // Determine number of clusters
    const k = num_clusters || Math.min(Math.ceil(texts.length / 3), 5);
    
    // Build vocabulary and convert texts to vectors
    const vocabulary = buildVocabulary(texts);
    const vectors = texts.map(text => textToVector(text, vocabulary));
    
    // Perform clustering
    const assignments = kmeansClustering(vectors, k);
    
    // Build clusters
    const clusters: Cluster[] = [];
    for (let i = 0; i < k; i++) {
      const clusterPoints = standardizedPoints.filter((_, index) => assignments[index] === i);
      const clusterVectors = vectors.filter((_, index) => assignments[index] === i);
      const clusterTexts = clusterPoints.map(point => point.content);
      
      if (clusterPoints.length > 0) {
        // Calculate centroid
        const centroid = new Array(vocabulary.length).fill(0);
        clusterVectors.forEach(vector => {
          vector.forEach((val, j) => {
            centroid[j] += val;
          });
        });
        centroid.forEach((_, j) => {
          centroid[j] /= clusterVectors.length;
        });
        
        // Generate AI-powered summary
        const summary = await generateClusterSummary(clusterTexts);
        
        clusters.push({
          id: i,
          data_points: clusterPoints,
          summary: summary,
          similarity_score: calculateSimilarityScore(clusterVectors, centroid),
          centroid
        });
      }
    }
    
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json({
      clusters,
      metadata: {
        total_points: standardizedPoints.length,
        processing_time: processingTime,
        algorithm: 'k-means'
      }
    });
    
  } catch (error) {
    console.error('Clustering error:', error);
    return NextResponse.json(
      { error: 'Failed to process clustering request' },
      { status: 500 }
    );
  }
}
