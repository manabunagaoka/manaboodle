// Utility to automatically extract article content for search
import fs from 'fs';
import path from 'path';

export interface ExtractedContent {
  content: string;
  author?: string;
}

export function extractArticleContent(articleId: string, category: string): ExtractedContent {
  try {
    // Construct the path to the article file
    let filePath: string;
    
    if (articleId === 'ai-nurturing-surrogate-caregivers') {
      filePath = path.join(process.cwd(), 'src/app/concepts/ai-nurturing/page.tsx');
    } else if (category === 'casestudy') {
      filePath = path.join(process.cwd(), `src/app/casestudies/${articleId}/page.tsx`);
    } else {
      filePath = path.join(process.cwd(), `src/app/${category}/${articleId}/page.tsx`);
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return { content: '', author: undefined };
    }

    // Read the file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Extract text content from JSX
    const extractedContent = extractTextFromJSX(fileContent);
    const extractedAuthor = extractAuthorFromJSX(fileContent);
    
    return {
      content: extractedContent,
      author: extractedAuthor
    };
  } catch (error) {
    console.warn(`Could not extract content for ${articleId}:`, error);
    return { content: '', author: undefined };
  }
}

function extractTextFromJSX(jsxContent: string): string {
  // Remove JSX syntax and extract readable text
  let text = jsxContent
    // Remove imports and exports
    .replace(/^import.*?;$/gm, '')
    .replace(/^export.*?$/gm, '')
    // Remove JSX tags but keep content
    .replace(/<[^>]*>/g, ' ')
    // Remove className and other attributes
    .replace(/className={[^}]*}/g, '')
    .replace(/href={[^}]*}/g, '')
    .replace(/src={[^}]*}/g, '')
    // Remove style objects
    .replace(/style={{[^}]*}}/g, '')
    // Remove JSX expressions but try to keep text
    .replace(/{[^}]*}/g, ' ')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    // Remove common JSX patterns
    .replace(/return\s*\(/g, '')
    .replace(/function\s+\w+\([^)]*\)/g, '')
    .replace(/const\s+\w+\s*=/g, '')
    .trim();

  // Extract meaningful sentences (longer than 20 characters)
  const sentences = text.split(/[.!?]+/).filter(sentence => 
    sentence.trim().length > 20 && 
    !sentence.includes('tsx') &&
    !sentence.includes('className') &&
    !sentence.includes('useState') &&
    !sentence.includes('useEffect')
  );

  return sentences.join('. ').trim();
}

function extractAuthorFromJSX(jsxContent: string): string | undefined {
  // Look for author patterns in the JSX
  const authorPatterns = [
    /by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
    /author.*?([A-Z][a-z]+\s+[A-Z][a-z]+)/gi,
    /Author.*?([A-Z][a-z]+\s+[A-Z][a-z]+)/gi
  ];

  for (const pattern of authorPatterns) {
    const match = pattern.exec(jsxContent);
    if (match && match[1]) {
      return match[1];
    }
  }

  return undefined;
}
