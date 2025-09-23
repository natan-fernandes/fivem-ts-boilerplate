# FiveM TypeScript Boilerplate - Quick Reference

## 🚀 Quick Commands

```bash
# Install dependencies
yarn install

# Create new resource (copy example)
cp -r resources/example resources/my-resource

# Build resource
yarn build my-resource

# Build NUI only
yarn build-nui my-resource

# Build with watch mode
yarn build my-resource true

# Generate Prisma client
npx prisma generate

# Database migration
npx prisma migrate dev
```

## 📁 File Structure

```
resources/my-resource/
├── fxmanifest.lua          # FiveM manifest
├── package.json            # Resource dependencies
└── src/
    ├── client/
    │   └── client.ts       # Client-side code
    ├── server/
    │   └── server.ts       # Server-side code
    └── web/                # NUI React app
        ├── package.json
        ├── vite.config.ts
        └── src/
            ├── main.tsx
            ├── components/
            └── utils/
```

## 🔧 Common Code Patterns

### Client-Server Communication
```typescript
// Client
const result = await emitNetPromise<string>('eventName', data);

// Server
onNetPromise<string>('eventName', (source, data) => {
  return `Response: ${data}`;
});
```

### NUI Communication
```typescript
// React Component
const data = await fetchNui<any>('callbackName', payload);

// Client Script
RegisterNUICallback('callbackName', (data, cb) => {
  cb({ success: true, data });
});
```

### Database Operations
```typescript
// Server
const user = await prisma.user.findUnique({
  where: { id: userId }
});
```

### NUI Visibility
```typescript
// Show NUI
SetNuiFocus(true, true);
SendNUIMessage({ action: 'setVisible', data: true });

// Hide NUI
SetNuiFocus(false, false);
SendNUIMessage({ action: 'setVisible', data: false });
```

## 🎯 Resource Types

### Without UI
- Remove NUI lines from `fxmanifest.lua`
- Focus on client-server communication
- Use commands and events

### With UI
- Keep NUI configuration in `fxmanifest.lua`
- Develop React components
- Use `fetchNui` for communication

## 🗄️ Database Schema Example

```prisma
model User {
  id        Int      @id @default(autoincrement())
  serverId  Int      @unique
  name      String
  money     Int      @default(0)
  createdAt DateTime @default(now())
}
```

## 🎨 NUI Development

### React Component Template
```typescript
import React, { useState } from 'react';
import { fetchNui } from '../utils/fetchNui';

const MyComponent: React.FC = () => {
  const [data, setData] = useState(null);

  const handleAction = async () => {
    const result = await fetchNui('myAction', {});
    setData(result);
  };

  return (
    <div>
      <button onClick={handleAction}>Action</button>
      {data && <p>{JSON.stringify(data)}</p>}
    </div>
  );
};
```

### CSS Styling
```css
.app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## 🔍 Common Events

### Client Events
```typescript
// Player spawn
AddEventHandler('playerSpawned', () => {
  console.log('Player spawned');
});

// Vehicle enter/exit
AddEventHandler('gameEventTriggered', (name, args) => {
  if (name === 'CEventNetworkPlayerEnteredVehicle') {
    // Handle vehicle entry
  }
});
```

### Server Events
```typescript
// Player connecting
on('playerConnecting', (name, setKickReason, deferrals) => {
  console.log(`${name} is connecting`);
});

// Player dropped
on('playerDropped', (reason) => {
  console.log(`Player dropped: ${reason}`);
});
```

## 🛡️ Security Patterns

### Input Validation
```typescript
const validateInput = (data: any): boolean => {
  if (typeof data !== 'object' || data === null) return false;
  if (data.length > 1000) return false;
  return true;
};
```

### SQL Injection Prevention
```typescript
// Safe with Prisma
const user = await prisma.user.findUnique({
  where: { id: userId } // Automatically escaped
});
```

## 🐛 Debugging

### Console Logging
```typescript
console.log('Debug info:', data);
console.error('Error:', error);
```

### NUI Debugging
```typescript
// In React component
console.log('NUI data:', data);

// In browser dev tools
// Check Network tab for fetchNui calls
```

## 📋 Checklist for New Resources

- [ ] Copy example resource
- [ ] Update `fxmanifest.lua` with resource name
- [ ] Update `package.json` with resource name
- [ ] Implement client logic in `client.ts`
- [ ] Implement server logic in `server.ts`
- [ ] Add NUI components if needed
- [ ] Test client-server communication
- [ ] Test NUI functionality
- [ ] Build and deploy resource
- [ ] Add to server.cfg

## 🔗 Useful Links

- [FiveM Docs](https://docs.fivem.net/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [React Docs](https://react.dev/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [esbuild Docs](https://esbuild.github.io/)