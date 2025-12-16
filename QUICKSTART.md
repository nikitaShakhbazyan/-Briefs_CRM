# Quick Start Guide

## Option 1: Docker (Recommended)

### 1. Start all services

```bash
docker-compose up -d
```

This will start:
- Next.js app on http://localhost:3000
- n8n on http://localhost:5678
- MongoDB on localhost:27017

### 2. Setup n8n workflows

1. Open http://localhost:5678
2. Go to "Workflows" → "Import from File"
3. Import `n8n-workflows/article-queue-processor.json`
4. Import `n8n-workflows/article-generator.json`
5. Activate both workflows

### 3. Create your first article

1. Open http://localhost:3000
2. Fill in the form:
   - Keyword: "AI Technology"
   - Brand Domain: "example.com"
   - Language: "en"
   - AI Tool: "Mock (Testing)"
3. Click "Create Article"
4. Wait 2 minutes for n8n to process
5. Watch status change: new → pending → completed
6. Click "View Full Article" when completed

---

## Option 2: Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your local MongoDB
```

### 3. Configure environment

Copy `.env.example` to `.env.local` and configure:

```bash
MONGODB_URI=mongodb://localhost:27017/briefs-crm
# Add API keys if using real AI providers
```

### 4. Start Next.js

```bash
npm run dev
```

Open http://localhost:3000

### 5. (Optional) Setup n8n

For full workflow automation:

```bash
npm install -g n8n
n8n start
```

Then import workflows as described in Option 1.

---

## Testing Without n8n

You can test the app without n8n by:
1. Creating articles (they will have status "new")
2. Manually calling the generate API:

```bash
# Get new articles
curl http://localhost:3000/api/articles/status/new

# Generate content
curl -X POST http://localhost:3000/api/articles/generate \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "AI Technology",
    "brandDomain": "example.com",
    "language": "en",
    "aiTool": "mock"
  }'

# Complete article
curl -X POST http://localhost:3000/api/articles/complete \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "YOUR_ARTICLE_ID",
    "content": "Generated content here..."
  }'
```

---

## AI Providers

### Mock Provider (No API key needed)
Use `aiTool: "mock"` for testing

### Real AI Providers
Add API keys to `.env.local`:

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=pplx-...
```

Then select the provider in the UI:
- GPT-4o Mini
- Claude 3.5 Sonnet
- Perplexity Sonar

---

## Troubleshooting

### Articles stuck in "new" status
- Check n8n is running
- Check both workflows are activated
- Check n8n logs for errors

### Docker issues
```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Clean restart
docker-compose down
docker-compose up -d
```

### MongoDB connection issues
Make sure MongoDB is running and accessible at the configured URI.

---

## Project Structure

```
/app
  /api/articles     # API routes
  /articles/[id]    # Article view page
  page.tsx          # Home page
/components         # React components
/lib
  /ai               # AI provider adapters
  /db               # Database layer
  /models           # Mongoose models
  /types            # TypeScript types
/n8n-workflows      # n8n workflow JSONs
```

---

## Next Steps

1. Explore the code in `/lib/ai` to understand the adapter pattern
2. Check `/app/api/articles` for API implementation
3. Review `/n8n-workflows/README.md` for workflow details
4. Try different AI providers
5. Modify the prompt in `/lib/ai/base-provider.ts`
