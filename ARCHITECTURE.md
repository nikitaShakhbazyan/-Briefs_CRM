# Architecture Documentation

## Overview

This project demonstrates a production-ready AI article generation system with background processing, implementing SaaS patterns and best practices.

---

## Design Principles

### 1. Efficiency

**No Unnecessary Re-processing**
- Articles have clear status transitions: `new` → `pending` → `completed`
- Once an article is in `pending`, it won't be picked up again
- MongoDB indexes optimize queries: `{ status: 1, createdAt: 1 }`

**Reasonable Database Queries**
- Repository pattern isolates all DB operations
- Lean queries return plain objects (no Mongoose overhead)
- Indexes on frequently queried fields

**Background Processing**
- n8n polls every 2 minutes (configurable)
- Asynchronous generation doesn't block user
- User can continue creating articles while others generate

### 2. Generic Design

**AI Provider Abstraction (Adapter Pattern)**
```typescript
interface AIProvider {
  generateArticle(params: GenerateArticleParams): Promise<string>;
}
```

Benefits:
- Add new providers without changing business logic
- Easy to test with Mock provider
- Consistent interface across all providers
- Provider-specific logic encapsulated

**Current Implementations:**
- `GPTProvider` - OpenAI GPT-4o-mini
- `ClaudeProvider` - Anthropic Claude 3.5 Sonnet
- `PerplexityProvider` - Perplexity Sonar
- `MockAIProvider` - Testing without API keys

**Adding New Provider (3 steps):**
1. Create class extending `BaseAIProvider`
2. Implement `generateArticle()` method
3. Add to `AIProviderFactory`

**Repository Pattern**
```typescript
class ArticleRepository {
  static async create()
  static async findByStatus()
  static async complete()
  // ...
}
```

Benefits:
- Database logic isolated from API routes
- Easy to test
- Can swap MongoDB for another DB
- Consistent interface

**Modular n8n Workflows**
- Main workflow: Queue Processor (polls for new articles)
- Sub-workflow: Article Generator (generates one article)
- Separation of concerns
- Reusable components

### 3. Code Quality

**TypeScript Throughout**
- Full type safety
- Interfaces for all data structures
- No `any` types (where possible)

**Clear Folder Structure**
```
/app              # Next.js routes (frontend + API)
/lib
  /ai             # AI provider layer
  /db             # Database layer
  /models         # Data models
  /types          # Type definitions
/components       # React components
/n8n-workflows    # Workflow definitions
```

**Separation of Concerns**
- API routes are thin controllers
- Business logic in services (Repository, AI providers)
- Data models separate from business logic
- Frontend components focused on presentation

---

## Technology Choices

### Next.js 14 (App Router)
- Modern React framework
- Built-in API routes
- Server-side rendering
- TypeScript support

### MongoDB with Mongoose
- Flexible schema
- Easy to evolve
- Good for JSON-like data
- Built-in validation

### n8n
- Visual workflow automation
- No code required for operations
- Easy to modify workflows
- Webhook support
- Scheduled triggers

### Docker
- Consistent environments
- Easy deployment
- Service orchestration
- Reproducible builds

---

## Key Architectural Patterns

### 1. Adapter Pattern (AI Providers)
**Problem:** Need to support multiple AI providers with different APIs

**Solution:** Common interface with provider-specific implementations

**Code:**
```typescript
// Interface
interface AIProvider {
  generateArticle(params): Promise<string>
}

// Factory
class AIProviderFactory {
  static createProvider(tool: AITool): AIProvider {
    switch(tool) {
      case 'gpt': return new GPTProvider()
      case 'claude': return new ClaudeProvider()
      // ...
    }
  }
}

// Usage
const provider = AIProviderFactory.createProvider(article.aiTool)
const content = await provider.generateArticle(params)
```

### 2. Repository Pattern (Database Access)
**Problem:** Need clean separation between business logic and data access

**Solution:** Centralized data access layer

**Code:**
```typescript
class ArticleRepository {
  static async create(input: CreateArticleInput): Promise<Article>
  static async findByStatus(status: ArticleStatus): Promise<Article[]>
  static async complete(id: string, content: string): Promise<Article>
}

// Usage in API route
const article = await ArticleRepository.create(input)
```

### 3. Producer-Consumer Pattern (n8n Workflows)
**Problem:** Need to process articles asynchronously without blocking user

**Solution:** Queue-based background processing

**Flow:**
```
User creates article (status: "new")
     ↓
Queue Processor polls every 2 min
     ↓
Finds "new" articles
     ↓
Triggers Generator for each
     ↓
Generator updates status to "pending"
     ↓
Calls AI provider
     ↓
Saves content, status: "completed"
```

### 4. Singleton Pattern (Database Connection)
**Problem:** MongoDB connection should be reused, not created per request

**Solution:** Cached connection with global state

**Code:**
```typescript
let cached = global.mongoose || { conn: null, promise: null }

async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri)
  }
  cached.conn = await cached.promise
  return cached.conn
}
```

---

## Error Handling

### API Routes
- Try-catch blocks around all async operations
- Proper HTTP status codes (400, 404, 500)
- Descriptive error messages
- Logged errors for debugging

### AI Providers
- API key validation on initialization
- Error propagation with context
- Graceful failure messages

### n8n Workflows
- Check for empty results
- IF nodes for conditional logic
- Error outputs visible in n8n UI

---

## Security Considerations

### API Keys
- Stored in environment variables
- Never committed to git
- Validated before use

### Input Validation
- Required fields checked
- Enum validation for AI tools
- Status validation
- MongoDB injection prevented by Mongoose

### Docker
- Non-root user in container
- Minimal base image (alpine)
- No secrets in Dockerfile

---

## Scalability Considerations

### Current Design
- Single server
- MongoDB standalone
- n8n single instance

### Future Improvements
1. **Horizontal Scaling**
   - Multiple Next.js instances behind load balancer
   - MongoDB replica set
   - n8n queue mode with Redis

2. **Caching**
   - Redis for session data
   - Cache generated articles
   - Rate limiting

3. **Monitoring**
   - Application logs
   - Error tracking (Sentry)
   - Performance monitoring
   - n8n execution logs

4. **Queue System**
   - Replace n8n with RabbitMQ/Bull
   - Job retries
   - Priority queues
   - Dead letter queue

---

## Testing Strategy

### Current State
- Mock AI provider for testing
- No automated tests (24h constraint)

### Recommended Tests

**Unit Tests:**
```typescript
describe('AIProviderFactory', () => {
  it('should create GPT provider', () => {
    const provider = AIProviderFactory.createProvider('gpt')
    expect(provider).toBeInstanceOf(GPTProvider)
  })
})

describe('ArticleRepository', () => {
  it('should create article with status new', async () => {
    const article = await ArticleRepository.create(input)
    expect(article.status).toBe('new')
  })
})
```

**Integration Tests:**
```typescript
describe('POST /api/articles', () => {
  it('should create article', async () => {
    const res = await fetch('/api/articles', {
      method: 'POST',
      body: JSON.stringify(validInput)
    })
    expect(res.status).toBe(201)
  })
})
```

**E2E Tests:**
- Create article via UI
- Wait for generation
- Verify completed status
- Check content displayed

---

## Performance Optimizations

### Database
- Indexes on `{ status: 1, createdAt: 1 }`
- Lean queries (no Mongoose document overhead)
- Connection pooling via Mongoose

### Frontend
- Client-side polling every 5 seconds
- React component memoization possible
- Code splitting via Next.js

### API
- Minimal data transfer
- Efficient JSON serialization
- No N+1 queries

### Docker
- Multi-stage builds
- Minimal image size
- Layer caching

---

## Deployment Checklist

- [ ] Configure environment variables
- [ ] Set up MongoDB (replica set for production)
- [ ] Configure AI provider API keys
- [ ] Deploy Next.js application
- [ ] Deploy n8n instance
- [ ] Import and activate workflows
- [ ] Configure reverse proxy (nginx)
- [ ] Set up SSL certificates
- [ ] Configure monitoring
- [ ] Set up backups
- [ ] Load testing
- [ ] Security audit

---

## Maintenance

### Regular Tasks
- Monitor n8n execution logs
- Check for failed generations
- Review API error rates
- Database backups
- Update dependencies

### Monitoring Metrics
- Article creation rate
- Generation success rate
- Average generation time
- API response times
- Database query performance

---

## Conclusion

This architecture demonstrates:
- ✅ Clean separation of concerns
- ✅ Extensible design (easy to add providers)
- ✅ Production-ready patterns
- ✅ Efficient resource usage
- ✅ Maintainable codebase
- ✅ Clear documentation

The system is ready for production with appropriate scaling and monitoring additions.
