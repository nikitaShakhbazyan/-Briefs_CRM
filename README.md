# AI Article Generator - Briefs CRM

A production-minded system demonstrating the full lifecycle of AI-generated articles - from user input through background processing to completion and display.

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **MongoDB** (with Mongoose)
- **n8n** (Workflow automation)
- **AI Providers**: OpenAI GPT, Anthropic Claude, Perplexity (extensible architecture)

## Features

- ✅ Article creation with multiple AI provider support
- ✅ Background processing with n8n workflows
- ✅ Real-time status tracking (new → pending → completed)
- ✅ Modular AI provider adapter pattern
- ✅ Clean separation of concerns

## Project Structure

```
/app                    # Next.js App Router pages and API routes
/lib
  /ai                   # AI provider adapters
  /db                   # Database connection and utilities
  /models               # Mongoose models
  /types                # TypeScript type definitions
/n8n-workflows          # n8n workflow JSON exports
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- n8n
- API keys for at least one AI provider

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd briefs-crm
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start MongoDB:
```bash
# Using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your local MongoDB installation
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for required configuration:

- `MONGODB_URI` - MongoDB connection string
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `ANTHROPIC_API_KEY` - Anthropic API key (optional)
- `PERPLEXITY_API_KEY` - Perplexity API key (optional)
- `N8N_WEBHOOK_URL` - n8n webhook URL for article completion

## Architecture

### Article Lifecycle

1. **User Input** → Next.js form submission
2. **Storage** → MongoDB with status: "new"
3. **Queue Processing** → n8n polls for new articles (every 2-5 min)
4. **Generation** → n8n triggers AI provider → generates content
5. **Completion** → n8n sends result back to API
6. **Display** → Frontend polls/refreshes to show completed articles

### AI Provider Abstraction

All AI providers implement a common interface:
```typescript
interface AIProvider {
  generateArticle(params: GenerateArticleParams): Promise<string>;
}
```

This allows easy addition of new providers without changing business logic.

## Development Stages

- [x] Stage 1: Project setup and configuration
- [ ] Stage 2: MongoDB schema and connection
- [ ] Stage 3: AI provider adapters
- [ ] Stage 4: Backend API routes
- [ ] Stage 5: Frontend article creation
- [ ] Stage 6: Frontend article list
- [ ] Stage 7: n8n workflows
- [ ] Stage 8: Docker setup

## Testing

```bash
npm test
```

## Docker

Start all services with Docker Compose:

```bash
docker-compose up
```

This will start:
- Next.js application
- MongoDB
- n8n

## License

MIT
