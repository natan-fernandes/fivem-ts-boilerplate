# Creating FiveM Resources - Step by Step Guide

This guide will walk you through creating a new FiveM resource using this TypeScript boilerplate, both with and without UI components.

## Prerequisites

- Node.js > v10.6
- Yarn (preferred) or npm
- FiveM server setup
- PostgreSQL database (for database features)

## Method 1: Creating a Resource WITHOUT UI

### Step 1: Copy the Example Resource

```bash
# Navigate to the resources directory
cd /workspace/resources

# Copy the example resource to create your new resource
cp -r example my-new-resource
```

### Step 2: Update Resource Configuration

1. **Update the manifest file** (`my-new-resource/fxmanifest.lua`):
```lua
fx_version "cerulean"
game "gta5"
client_script "client.js"
server_script "server.js"

-- Remove or comment out NUI-related lines if no UI needed
-- ui_page 'nui/index.html'
-- files { 'nui/**/*' }
```

2. **Update package.json** (`my-new-resource/package.json`):
```json
{
    "name": "my-new-resource",
    "version": "1.0.0",
    "license": "MIT",
    "devDependencies": {
      "@citizenfx/client": "^2.0.6043-1",
      "@citizenfx/server": "^2.0.6043-1"
    }
}
```

### Step 3: Implement Client-Side Logic

Edit `my-new-resource/src/client/client.ts`:

```typescript
import { emitNetPromise } from '@common/shared';

// Example: Simple command that sends data to server
RegisterCommand('mycommand', async () => {
  try {
    const result = await emitNetPromise<string>('mycommand', 'Hello from client!');
    console.log('Server response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}, false);

// Example: Event handler for server events
onNet('serverEvent', (data: any) => {
  console.log('Received from server:', data);
});

// Example: Player spawn event
AddEventHandler('playerSpawned', () => {
  console.log('Player spawned!');
});
```

### Step 4: Implement Server-Side Logic

Edit `my-new-resource/src/server/server.ts`:

```typescript
import { onNetPromise } from '@common/shared';
// import { PrismaClient } from '@prisma/client'; // Uncomment if using database

// const prisma = new PrismaClient(); // Uncomment if using database

// Handle client commands with promise-based communication
onNetPromise<string>('mycommand', (source, message) => {
  console.log(`Player ${source} sent: ${message}`);
  return `Server received: ${message}`;
});

// Example: Player connection event
on('playerConnecting', (name: string, setKickReason: Function, deferrals: any) => {
  console.log(`${name} is connecting...`);
});

// Example: Player dropped event
on('playerDropped', (reason: string) => {
  console.log(`Player dropped: ${reason}`);
});

// Example: Database operation (uncomment if using Prisma)
/*
onNetPromise<any>('getPlayerData', async (source) => {
  try {
    const playerData = await prisma.player.findUnique({
      where: { id: source }
    });
    return playerData;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
});
*/
```

### Step 5: Build and Deploy

```bash
# From the project root
yarn build my-new-resource
```

This will:
- Compile TypeScript to JavaScript
- Bundle the code
- Copy files to your server's resource folder
- Generate `client.js` and `server.js` files

### Step 6: Add to Server

Add your resource to your server's `server.cfg`:
```
ensure my-new-resource
```

## Method 2: Creating a Resource WITH UI

### Step 1: Copy the Example Resource

```bash
cd /workspace/resources
cp -r example my-ui-resource
```

### Step 2: Update Resource Configuration

1. **Keep the manifest file** (`my-ui-resource/fxmanifest.lua`) as is:
```lua
fx_version "cerulean"
game "gta5"
client_script "client.js"
server_script "server.js"

ui_page 'nui/index.html'

files {
  'nui/**/*'	
}
```

2. **Update package.json** with your resource name:
```json
{
    "name": "my-ui-resource",
    "version": "1.0.0",
    "license": "MIT",
    "devDependencies": {
      "@citizenfx/client": "^2.0.6043-1",
      "@citizenfx/server": "^2.0.6043-1"
    }
}
```

### Step 3: Implement Client-Side Logic

Edit `my-ui-resource/src/client/client.ts`:

```typescript
import { emitNetPromise } from '@common/shared';

// NUI visibility management
const setNuiVisible = (visible: boolean) => {
  SetNuiFocus(visible, visible);
  SendNUIMessage({
    action: 'setVisible',
    data: visible
  });
};

// Command to open UI
RegisterCommand('openui', () => {
  setNuiVisible(true);
}, false);

// Command to close UI
RegisterCommand('closeui', () => {
  setNuiVisible(false);
}, false);

// Handle NUI callbacks
RegisterNUICallback('closeUI', () => {
  setNuiVisible(false);
});

RegisterNUICallback('getData', async (data: any, cb: Function) => {
  try {
    const result = await emitNetPromise<any>('getData', data);
    cb(result);
  } catch (error) {
    cb({ error: error.message });
  }
});

// Handle ESC key to close UI
RegisterKeyMapping('closeui', 'Close UI', 'keyboard', 'ESCAPE');
```

### Step 4: Implement Server-Side Logic

Edit `my-ui-resource/src/server/server.ts`:

```typescript
import { onNetPromise } from '@common/shared';
// import { PrismaClient } from '@prisma/client'; // Uncomment if using database

// const prisma = new PrismaClient(); // Uncomment if using database

// Handle data requests from NUI
onNetPromise<any>('getData', (source, data) => {
  console.log(`Player ${source} requested data:`, data);
  
  // Example: Return player-specific data
  return {
    playerId: source,
    timestamp: Date.now(),
    message: 'Hello from server!'
  };
});

// Example: Database operation for UI
/*
onNetPromise<any>('getPlayerStats', async (source) => {
  try {
    const stats = await prisma.playerStats.findUnique({
      where: { playerId: source }
    });
    return stats;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
});
*/
```

### Step 5: Customize the React UI

Edit `my-ui-resource/src/web/src/components/App.tsx`:

```typescript
import './App.css'
import React, { useEffect, useState } from 'react';
import { fetchNui } from "../utils/fetchNui";

const App: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const result = await fetchNui<any>('getData', { requestType: 'playerData' });
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeUI = () => {
    fetchNui('closeUI');
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="app">
      <div className="ui-container">
        <h1>My Resource UI</h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>Player ID: {data?.playerId}</p>
            <p>Message: {data?.message}</p>
            <p>Timestamp: {new Date(data?.timestamp).toLocaleString()}</p>
          </div>
        )}
        
        <button onClick={getData}>Refresh Data</button>
        <button onClick={closeUI}>Close</button>
      </div>
    </div>
  );
};

export default App;
```

### Step 6: Style the UI

Edit `my-ui-resource/src/web/src/components/App.css`:

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
  font-family: Arial, sans-serif;
}

.ui-container {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
}

.ui-container h1 {
  margin-top: 0;
  color: #333;
}

.ui-container button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.ui-container button:hover {
  background: #0056b3;
}
```

### Step 7: Build and Deploy

```bash
# Build the NUI first
yarn build-nui my-ui-resource

# Then build the entire resource
yarn build my-ui-resource
```

### Step 8: Add to Server

Add your resource to your server's `server.cfg`:
```
ensure my-ui-resource
```

## Development Tips

### Watch Mode for Development

For faster development, use watch mode:

```bash
# Build with watch mode
yarn build my-resource true
```

This will automatically rebuild when you make changes to your TypeScript files.

### Database Setup

If using Prisma for database operations:

1. Set up your database connection in `.env`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/fivem_db"
```

2. Generate Prisma client:
```bash
npx prisma generate
```

3. Run migrations:
```bash
npx prisma migrate dev
```

### Common Patterns

1. **Client-Server Communication**: Use `emitNetPromise` and `onNetPromise` for reliable communication
2. **NUI Communication**: Use `fetchNui` in React components to communicate with FiveM
3. **Error Handling**: Always wrap async operations in try-catch blocks
4. **Resource Management**: Clean up event listeners and database connections properly

### Testing

- Use the browser for NUI development (the debug data will show the UI)
- Test client-server communication in-game
- Use console logs for debugging
- Test database operations with proper error handling

## Troubleshooting

### Common Issues

1. **Build Errors**: Check TypeScript syntax and imports
2. **NUI Not Showing**: Ensure the NUI was built and files are in the correct location
3. **Database Errors**: Verify Prisma client is generated and database is accessible
4. **Network Events Not Working**: Check event names match between client and server

### Debug Commands

- Use `console.log()` for debugging
- Check FiveM server console for errors
- Use browser developer tools for NUI debugging
- Monitor network traffic for event communication