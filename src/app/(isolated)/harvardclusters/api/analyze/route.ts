import { NextRequest, NextResponse } from 'next/server';

interface ClusterData {
  clusters: Array<{
    id: number;
    data_points: Array<{
      content: string;
      id: string;
    }>;
    summary: string;
    similarity_score: number;
  }>;
}

interface Segment {
  name: string;
  percentage: number;
  count: number;
  color: string;
  insight: string;
  quote: string;
  summary: string;
}

export async function POST(request: NextRequest) {
  try {
    const { rawData } = await request.json();
    
    if (!rawData || rawData.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide more interview data for analysis' }, 
        { status: 400 }
      );
    }

    // Parse rawData into individual interview chunks
    const interviews = rawData
      .split(/Interview \d+/)
      .filter((chunk: string) => chunk.trim().length > 20)
      .map((chunk: string) => chunk.trim());

    if (interviews.length < 2) {
      return NextResponse.json(
        { error: 'Please provide at least 2 interviews for clustering analysis' }, 
        { status: 400 }
      );
    }

    // Call our existing clean synchronicity clustering API
    const clusterResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/synchronicity/cluster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data_points: interviews,
        num_clusters: 4
      })
    });

    if (!clusterResponse.ok) {
      throw new Error('Clustering analysis failed');
    }

    const clusterData: ClusterData = await clusterResponse.json();

    // Transform the clusters into Harvard-specific format
    const segments: Segment[] = clusterData.clusters.map((cluster, index: number) => {
      const colors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];
      
      // Extract percentage based on cluster size
      const percentage = Math.round((cluster.data_points.length / interviews.length) * 100);
      
      // Generate segment names based on AI analysis
      let segmentName = `Segment ${index + 1}`;
      if (cluster.summary.toLowerCase().includes('trust') || cluster.summary.toLowerCase().includes('reliable')) {
        segmentName = 'Consistency Focused';
      } else if (cluster.summary.toLowerCase().includes('flexible') || cluster.summary.toLowerCase().includes('schedule')) {
        segmentName = 'Flexibility Seekers';
      } else if (cluster.summary.toLowerCase().includes('special') || cluster.summary.toLowerCase().includes('medical')) {
        segmentName = 'Specialized Needs';
      } else if (cluster.summary.toLowerCase().includes('comprehensive') || cluster.summary.toLowerCase().includes('support')) {
        segmentName = 'Comprehensive Support';
      }

      // Get the most representative quote from cluster data
      const quote = cluster.data_points[0]?.content || 'Representative customer feedback from this segment.';

      return {
        name: segmentName,
        percentage: Math.max(percentage, 10), // Minimum 10% to avoid 0% segments
        count: cluster.data_points.length,
        color: colors[index % colors.length],
        insight: cluster.summary,
        quote: quote.length > 150 ? quote.substring(0, 150) + '...' : quote,
        summary: `This segment represents ${percentage}% of your customer base and shows distinct patterns that create specific business opportunities for targeted solutions.`
      };
    });

    // Normalize percentages to add up to 100%
    const totalPercentage = segments.reduce((sum: number, seg: Segment) => sum + seg.percentage, 0);
    if (totalPercentage !== 100) {
      segments.forEach((seg: Segment) => {
        seg.percentage = Math.round((seg.percentage / totalPercentage) * 100);
      });
    }

    return NextResponse.json({ segments });
    
  } catch (error) {
    console.error('Harvard Clusters analysis error:', error);
    
    // Return user-friendly error message
    return NextResponse.json(
      { 
        error: 'Analysis temporarily unavailable. Please try again in a moment.',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      }, 
      { status: 500 }
    );
  }
}
