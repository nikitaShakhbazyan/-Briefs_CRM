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

- [x] Project setup and configuration
- [x] MongoDB schema and connection
- [x] AI provider adapters
- [x] Backend API routes
- [x] Frontend article creation
- [x] Frontend article list
- [x] n8n workflows
- [x] Docker setup

## API Endpoints

### Articles
- `POST /api/articles` - Create new article
- `GET /api/articles` - Get all articles
- `GET /api/articles/[id]` - Get article by ID
- `GET /api/articles/status/[status]` - Get articles by status (for n8n)
- `PATCH /api/articles/[id]/status` - Update article status (for n8n)
- `POST /api/articles/generate` - Generate article content (for n8n)
- `POST /api/articles/complete` - Complete article with content (for n8n)

## Docker Deployment

### Quick Start with Docker

Start all services (Next.js, MongoDB, n8n):

```bash
docker-compose up -d
```

Services will be available at:
- **Next.js Application**: http://localhost:3000
- **n8n Workflow Automation**: http://localhost:5678
- **MongoDB**: localhost:27017

### Import n8n Workflows

1. Open n8n at http://localhost:5678
2. Import workflows from `/n8n-workflows` directory:
   - `article-queue-processor.json`
   - `article-generator.json`
3. Activate both workflows
4. Workflows will automatically process articles every 2 minutes

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f
```

## Development (Without Docker)

### Prerequisites
- Node.js 18+
- MongoDB running locally
- n8n running locally (optional, for testing full workflow)

### Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Manual n8n Setup

If not using Docker, install n8n separately:

```bash
npm install -g n8n
n8n start
```

Then import workflows as described above.

## Testing

The application includes a **Mock AI Provider** for testing without API keys:

1. Set `AI Tool` to "Mock (Testing)" in the form
2. Articles will be generated with demo content
3. No API keys required

For production, configure real AI providers in `.env.local`.

## Architecture Highlights

### Efficiency
- MongoDB indexes on status and createdAt for fast queries
- n8n polls every 2 minutes (configurable)
- No unnecessary re-processing
- Clean status transitions (new → pending → completed)

### Generic Design
- AI providers use Adapter Pattern
- Easy to add new AI providers
- Repository pattern for database operations
- Modular n8n workflows (main + sub-flow)

### Code Quality
- TypeScript throughout
- Clear folder structure
- Typed models and interfaces
- Separation of concerns
- ESLint configured
