# n8n Workflows

This directory contains n8n workflow definitions for the AI Article Generator.

## Workflows

### 1. Article Queue Processor (`article-queue-processor.json`)

**Purpose**: Polls MongoDB for articles with status "new" every 2-5 minutes and triggers article generation.

**Trigger**: Schedule (every 2 minutes)

**Steps**:
1. HTTP Request to GET `/api/articles/status/new`
2. If articles found, loop through each
3. For each article, trigger Article Generator workflow

### 2. Article Generator (`article-generator.json`)

**Purpose**: Generates article content using the selected AI provider and updates the article.

**Trigger**: Webhook (called by Queue Processor)

**Steps**:
1. Receive article data (id, keyword, brandDomain, language, aiTool)
2. Update article status to "pending" via PATCH `/api/articles/[id]/status`
3. Generate content via POST `/api/articles/generate`
4. Complete article via POST `/api/articles/complete` with generated content

## Setup Instructions

### Prerequisites
- n8n installed and running (default: http://localhost:5678)
- Next.js application running (default: http://localhost:3000)
- MongoDB running with articles collection

### Import Workflows

1. Open n8n at http://localhost:5678
2. Click "Add workflow" → "Import from File"
3. Import `article-queue-processor.json`
4. Import `article-generator.json`
5. Activate both workflows

### Configuration

Both workflows are pre-configured to work with:
- Next.js API: `http://localhost:3000`
- MongoDB via Next.js API endpoints

**Important**: Update the webhook URL in Article Queue Processor if your n8n instance is not on localhost:5678

### Testing

1. Create an article via the frontend
2. Wait up to 2 minutes for the queue processor to pick it up
3. Check article status changes: new → pending → completed
4. View the generated content

## Manual Workflow JSON Structure

If you prefer to create workflows manually in n8n:

### Article Queue Processor
1. **Schedule Trigger**: Every 2 minutes
2. **HTTP Request**: GET `http://localhost:3000/api/articles/status/new`
3. **IF Node**: Check if articles.length > 0
4. **Loop Over Items**: For each article
5. **HTTP Request**: POST to Article Generator webhook with article data

### Article Generator
1. **Webhook Trigger**: Listen for POST requests
2. **HTTP Request**: PATCH `http://localhost:3000/api/articles/{{$json.articleId}}/status` with body `{"status": "pending"}`
3. **HTTP Request**: POST `http://localhost:3000/api/articles/generate` with article params
4. **HTTP Request**: POST `http://localhost:3000/api/articles/complete` with generated content

## Troubleshooting

- **Workflows not running**: Check that both workflows are activated
- **Articles stuck in "new"**: Check n8n logs for errors
- **Generation fails**: Verify API keys in `.env.local` if using real AI providers
- **Use Mock provider**: Set aiTool to "mock" for testing without API keys
