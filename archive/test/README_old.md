# Manaboodle CSS Architecture Guide

## Overview

This project uses a **modular CSS approach** with CSS Modules, where each page type has its own dedicated stylesheet. This allows for maximum flexibility and unique styling for individual articles while maintaining consistency where needed.

## CSS File Structure
src/app/
├── [category]/
│   ├── page.tsx                    # Category listing page
│   ├── [category].module.css       # Styles for category listing
│   └── [article-slug]/
│       ├── page.tsx                # Individual article page
│       └── article.module.css      # Article-specific styles

## CSS Organization Pattern

### 1. Category Listing Pages
Each category has its own listing page with dedicated styling:

- **Location**: `app/[category]/[category].module.css`
- **Examples**: 
  - `projects/projects.module.css` (Green theme)
  - `concepts/concepts.module.css` (Blue theme)
  - `random/random.module.css` (Purple theme)
  - `casestudies/casestudies.module.css` (Red theme)
- **Purpose**: Styles the grid layout, cards, and category-specific theming

### 2. Individual Article Pages
Each article can have its own unique styling:

- **Location**: `app/[category]/[article-slug]/article.module.css`
- **Examples**:
  - `projects/karaokegogo/article.module.css`
  - `concepts/ai-nurturing/article.module.css`
  - `random/vibe-coding/article.module.css`
- **Purpose**: Allows complete customization per article

### 3. Static Pages
Standard pages follow the same pattern:

- **Location**: `app/[page-name]/page.module.css`
- **Examples**:
  - `contact/contact.module.css`
  - `privacy/page.module.css` (to be created)
  - `terms/page.module.css` (to be created)

## Color Themes by Category

Each category has its own color theme that's consistently used:

| Category | Primary Color | Color Code | Used In |
|----------|--------------|------------|---------|
| Projects | Green | `#059669` | Links, borders, buttons, category badges |
| Concepts | Blue | `#2563EB` | Links, borders, buttons, category badges |
| Random | Purple | `#7C3AED` | Links, borders, buttons, category badges |
| Case Studies | Red | `#DC2626` | Links, borders, buttons, category badges |

## Common CSS Classes and Patterns

### Article Pages (`article.module.css`)

```css
.articlePage        /* Main container */
.articleHeader      /* Article header section */
.articleTitle       /* Main article title */
.articleCategory    /* Category badge */
.backLink          /* Back navigation link */
.sectionHeading    /* Section headers within article */
.articleContent    /* Main content wrapper */
.importantNote     /* Highlighted note boxes */
.comparisonTable   /* Styled comparison tables */
Category Pages ([category].module.css)
css.projectsPage      /* Main container (named per category) */
.pageHeader        /* Category page header */
.pageTitle         /* Category title */
.articlesGrid      /* Grid layout for article cards */
.contentCard       /* Individual article card */
.cardCategory      /* Category badge on card */
.readButton        /* Read more button */
Why This Approach?
Advantages:

Maximum Flexibility: Each article can have completely unique styling

Custom layouts for special content
Article-specific animations or effects
Unique typography or spacing needs


Category Consistency: Shared patterns within categories while allowing variations
Easy to Understand: Clear file structure where styles live with their content
No Conflicts: CSS Modules prevent style leakage between pages
Performance: Only loads CSS needed for the current page

Trade-offs:

Some code duplication across article CSS files
Need to update multiple files for global style changes
Larger overall CSS footprint

Creating New Content
New Article

Create folder: app/[category]/[article-slug]/
Add page.tsx for content
Copy article.module.css from another article in the same category
Modify styles as needed for unique requirements

New Category

Create folder: app/[new-category]/
Add page.tsx for category listing
Create [new-category].module.css with category color theme
Define new color in the CSS file

New Static Page

Create folder: app/[page-name]/
Add page.tsx for content
Create page.module.css for styling

Best Practices

Start with a Copy: When creating new articles, copy an existing article.module.css from the same category to maintain consistency
Document Unique Styles: If an article has special styling needs, add comments explaining why
Maintain Category Colors: Keep color themes consistent within categories unless there's a specific design reason
Mobile-First: Ensure all custom styles include mobile responsive breakpoints
Test Across Categories: When updating shared patterns, check multiple articles

Example: Custom Article Styling
css/* article.module.css for a special interactive article */

/* Standard styles inherited from category... */

/* Custom styles for this article only */
.interactiveDemo {
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    border-radius: 12px;
    margin: 2rem 0;
}

.animatedElement {
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}
Maintenance Guidelines
When making style updates:

Global Changes: Update each relevant CSS file individually
Category-wide Changes: Update all article.module.css files in that category
Testing: Always test in multiple articles and screen sizes
Documentation: Update this README if adding new patterns

Future Considerations
While the current approach prioritizes flexibility, consider these options if maintenance becomes challenging:

Extract truly common styles to a shared CSS file
Use CSS custom properties for repeated values
Create a style guide page showing all variations
Consider a hybrid approach for new categories


Remember: The goal is to balance flexibility with maintainability. This architecture allows for creative freedom while maintaining enough structure for consistency.
