# FiveM TypeScript Boilerplate - AI Agent Documentation

This directory contains comprehensive documentation and rules for AI agents working with this FiveM TypeScript boilerplate project.

## 📁 Directory Structure

```
.cursor/
├── README.md              # This file - overview of AI documentation
├── rules                  # Core rules for AI agent understanding
└── docs/                  # Detailed documentation
    ├── creating-resources.md  # Step-by-step resource creation guide
    ├── examples.md            # Code examples and templates
    └── architecture.md        # Project architecture and patterns
```

## 🎯 Quick Start for AI Agents

### Understanding This Project

This is a **FiveM TypeScript boilerplate** for creating server resources with:
- **TypeScript** for type-safe development
- **React + Vite** for modern NUI (Native User Interface)
- **Prisma ORM** with PostgreSQL for database operations
- **esbuild** for fast compilation and bundling
- **Promise-based communication** between client and server

### Key Concepts

1. **Resources**: Self-contained FiveM server components
2. **Client Scripts**: Run in the game client (browser environment)
3. **Server Scripts**: Run on the server (Node.js environment)
4. **NUI**: React-based user interfaces displayed in-game
5. **emitNetPromise/onNetPromise**: Promise-based client-server communication

### Common Tasks

#### Creating a New Resource
1. Copy the `example` resource: `cp -r resources/example resources/my-resource`
2. Update `fxmanifest.lua` and `package.json` with your resource name
3. Implement client/server logic in TypeScript
4. Build with: `yarn build my-resource`

#### Adding NUI (User Interface)
1. Keep the NUI configuration in `fxmanifest.lua`
2. Develop React components in `src/web/src/`
3. Use `fetchNui` for React-to-FiveM communication
4. Build NUI with: `yarn build-nui my-resource`

#### Database Integration
1. Define schema in `prisma/schema.prisma`
2. Generate Prisma client: `npx prisma generate`
3. Use `PrismaClient` in server scripts
4. Handle database operations with proper error handling

## 📚 Documentation Files

### [`rules`](./rules)
Core rules and patterns that AI agents should follow when working with this project. Includes:
- Project structure overview
- Key technologies and their purposes
- Development workflow
- Important patterns and conventions
- Build commands and database setup

### [`docs/creating-resources.md`](./docs/creating-resources.md)
Comprehensive step-by-step guide for creating FiveM resources:
- **Method 1**: Resources WITHOUT UI (client-server only)
- **Method 2**: Resources WITH UI (includes React NUI)
- Development tips and troubleshooting
- Common patterns and best practices

### [`docs/examples.md`](./docs/examples.md)
Practical code examples and templates:
- Basic resource templates
- Database integration examples
- NUI communication patterns
- Common game events and utilities
- Data validation and security patterns

### [`docs/architecture.md`](./docs/architecture.md)
Deep dive into project architecture:
- High-level system overview
- Build system configuration
- Development patterns and communication flows
- File structure and organization
- Performance and security considerations

## 🛠️ Development Workflow

### For AI Agents Working on This Project

1. **Read the Rules**: Start with `rules` to understand the project structure
2. **Follow the Guide**: Use `creating-resources.md` for step-by-step instructions
3. **Reference Examples**: Check `examples.md` for code patterns and templates
4. **Understand Architecture**: Review `architecture.md` for deeper understanding

### Key Commands

```bash
# Install dependencies
yarn install

# Build a resource
yarn build <resourceName>

# Build NUI only
yarn build-nui <resourceName>

# Build with watch mode
yarn build <resourceName> true

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

### File Locations

- **Resources**: `/workspace/resources/<resourceName>/`
- **Client Code**: `src/client/client.ts`
- **Server Code**: `src/server/server.ts`
- **NUI Code**: `src/web/src/` (React app)
- **Manifest**: `fxmanifest.lua`
- **Database Schema**: `prisma/schema.prisma`

## 🔧 Common Patterns

### Client-Server Communication
```typescript
// Client
const result = await emitNetPromise<string>('myEvent', 'data');

// Server
onNetPromise<string>('myEvent', (source, data) => {
  return `Processed: ${data}`;
});
```

### NUI Communication
```typescript
// React Component
const data = await fetchNui<any>('getData', { id: 1 });

// Client Script
RegisterNUICallback('getData', async (data, cb) => {
  const result = await emitNetPromise('getData', data);
  cb(result);
});
```

### Database Operations
```typescript
// Server
const user = await prisma.user.findUnique({
  where: { id: userId }
});
```

## 🚨 Important Notes

1. **TypeScript**: All code should be written in TypeScript with proper typing
2. **Error Handling**: Always wrap async operations in try-catch blocks
3. **Resource Isolation**: Each resource should be self-contained
4. **Database**: Use Prisma for all database operations
5. **NUI**: Use React with proper state management
6. **Build Process**: Always build resources before testing

## 📖 Additional Resources

- [FiveM Documentation](https://docs.fivem.net/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [esbuild Documentation](https://esbuild.github.io/)

## 🤝 Contributing

When working with this project:
1. Follow the established patterns and conventions
2. Use TypeScript for all new code
3. Include proper error handling
4. Test both client and server functionality
5. Update documentation if adding new patterns

This documentation is designed to help AI agents understand and work effectively with this FiveM TypeScript boilerplate project.