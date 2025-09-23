# FiveM TypeScript Boilerplate - Examples and Templates

This document provides practical examples and templates for common FiveM resource patterns using this TypeScript boilerplate.

## Table of Contents

1. [Basic Resource Templates](#basic-resource-templates)
2. [Database Integration Examples](#database-integration-examples)
3. [NUI Communication Patterns](#nui-communication-patterns)
4. [Common Game Events](#common-game-events)
5. [Utility Functions](#utility-functions)

## Basic Resource Templates

### Simple Command Resource

**Client-side** (`src/client/client.ts`):
```typescript
import { emitNetPromise } from '@common/shared';

// Simple command that sends data to server
RegisterCommand('hello', async () => {
  try {
    const response = await emitNetPromise<string>('hello', 'Hello from client!');
    console.log('Server response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}, false);

// Command with parameters
RegisterCommand('teleport', async (source: any, args: string[]) => {
  if (args.length < 3) {
    console.log('Usage: /teleport <x> <y> <z>');
    return;
  }
  
  const [x, y, z] = args.map(Number);
  const playerPed = PlayerPedId();
  SetEntityCoords(playerPed, x, y, z, false, false, false, true);
}, false);
```

**Server-side** (`src/server/server.ts`):
```typescript
import { onNetPromise } from '@common/shared';

onNetPromise<string>('hello', (source, message) => {
  console.log(`Player ${source} says: ${message}`);
  return `Server received: ${message}`;
});

// Handle player commands
on('chatMessage', (source: number, name: string, message: string) => {
  console.log(`[CHAT] ${name}: ${message}`);
});
```

### Player Management Resource

**Client-side** (`src/client/client.ts`):
```typescript
import { emitNetPromise } from '@common/shared';

// Player spawn event
AddEventHandler('playerSpawned', () => {
  console.log('Player spawned!');
  emitNetPromise('playerSpawned', {
    playerId: GetPlayerServerId(PlayerId()),
    timestamp: Date.now()
  });
});

// Health monitoring
setInterval(() => {
  const playerPed = PlayerPedId();
  const health = GetEntityHealth(playerPed);
  
  if (health < 100) {
    emitNetPromise('lowHealth', { health });
  }
}, 5000);
```

**Server-side** (`src/server/server.ts`):
```typescript
import { onNetPromise } from '@common/shared';

onNetPromise<any>('playerSpawned', (source, data) => {
  console.log(`Player ${source} spawned at ${new Date(data.timestamp)}`);
  
  // Set player data, give items, etc.
  return { success: true };
});

onNetPromise<any>('lowHealth', (source, data) => {
  console.log(`Player ${source} has low health: ${data.health}`);
  
  // Send notification, heal player, etc.
  emitNet('healPlayer', source);
  return { healed: true };
});
```

## Database Integration Examples

### Player Data Management

**Prisma Schema** (`prisma/schema.prisma`):
```prisma
model Player {
  id        Int      @id @default(autoincrement())
  serverId  Int      @unique
  name      String
  money     Int      @default(0)
  level     Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  vehicles Vehicle[]
  houses   House[]
}

model Vehicle {
  id       Int    @id @default(autoincrement())
  plate    String @unique
  model    String
  ownerId  Int
  owner    Player @relation(fields: [ownerId], references: [id])
}

model House {
  id      Int    @id @default(autoincrement())
  address String
  price   Int
  ownerId Int
  owner   Player @relation(fields: [ownerId], references: [id])
}
```

**Server-side Database Operations** (`src/server/server.ts`):
```typescript
import { PrismaClient } from '@prisma/client';
import { onNetPromise } from '@common/shared';

const prisma = new PrismaClient();

// Get or create player
onNetPromise<any>('getPlayerData', async (source) => {
  try {
    let player = await prisma.player.findUnique({
      where: { serverId: source }
    });
    
    if (!player) {
      player = await prisma.player.create({
        data: {
          serverId: source,
          name: GetPlayerName(source.toString()),
          money: 5000,
          level: 1
        }
      });
    }
    
    return player;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
});

// Update player money
onNetPromise<any>('updateMoney', async (source, amount) => {
  try {
    const player = await prisma.player.update({
      where: { serverId: source },
      data: { money: { increment: amount } }
    });
    
    return player;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
});

// Get player vehicles
onNetPromise<any>('getPlayerVehicles', async (source) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { owner: { serverId: source } }
    });
    
    return vehicles;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
});
```

## NUI Communication Patterns

### Inventory System UI

**Client-side** (`src/client/client.ts`):
```typescript
import { emitNetPromise } from '@common/shared';

const setNuiVisible = (visible: boolean) => {
  SetNuiFocus(visible, visible);
  SendNUIMessage({
    action: 'setVisible',
    data: visible
  });
};

// Open inventory
RegisterCommand('inventory', () => {
  setNuiVisible(true);
  emitNetPromise('getInventory').then(inventory => {
    SendNUIMessage({
      action: 'setInventory',
      data: inventory
    });
  });
}, false);

// Handle NUI callbacks
RegisterNUICallback('useItem', async (data: any, cb: Function) => {
  try {
    const result = await emitNetPromise('useItem', data);
    cb(result);
  } catch (error) {
    cb({ error: error.message });
  }
});

RegisterNUICallback('closeInventory', () => {
  setNuiVisible(false);
});
```

**React Component** (`src/web/src/components/Inventory.tsx`):
```typescript
import React, { useState, useEffect } from 'react';
import { fetchNui } from '../utils/fetchNui';

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  description: string;
}

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const useItem = async (itemId: number) => {
    setLoading(true);
    try {
      const result = await fetchNui('useItem', { itemId });
      if (result.success) {
        // Refresh inventory
        const updatedInventory = await fetchNui('getInventory');
        setInventory(updatedInventory);
      }
    } catch (error) {
      console.error('Error using item:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeInventory = () => {
    fetchNui('closeInventory');
  };

  return (
    <div className="inventory">
      <div className="inventory-header">
        <h2>Inventory</h2>
        <button onClick={closeInventory}>×</button>
      </div>
      
      <div className="inventory-grid">
        {inventory.map(item => (
          <div key={item.id} className="inventory-item">
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>{item.description}</p>
            <button 
              onClick={() => useItem(item.id)}
              disabled={loading}
            >
              Use
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
```

### Settings/Configuration UI

**React Component** (`src/web/src/components/Settings.tsx`):
```typescript
import React, { useState, useEffect } from 'react';
import { fetchNui } from '../utils/fetchNui';

interface Settings {
  volume: number;
  graphics: string;
  notifications: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    volume: 50,
    graphics: 'medium',
    notifications: true
  });

  const updateSetting = async (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await fetchNui('updateSettings', newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      
      <div className="setting-group">
        <label>Volume: {settings.volume}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.volume}
          onChange={(e) => updateSetting('volume', parseInt(e.target.value))}
        />
      </div>
      
      <div className="setting-group">
        <label>Graphics Quality:</label>
        <select
          value={settings.graphics}
          onChange={(e) => updateSetting('graphics', e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => updateSetting('notifications', e.target.checked)}
          />
          Enable Notifications
        </label>
      </div>
    </div>
  );
};

export default Settings;
```

## Common Game Events

### Vehicle System

**Client-side** (`src/client/client.ts`):
```typescript
import { emitNetPromise } from '@common/shared';

// Vehicle enter/exit events
AddEventHandler('gameEventTriggered', (name: string, args: any[]) => {
  if (name === 'CEventNetworkPlayerEnteredVehicle') {
    const [playerId, vehicleId, seat] = args;
    emitNetPromise('playerEnteredVehicle', {
      playerId,
      vehicleId,
      seat
    });
  }
  
  if (name === 'CEventNetworkPlayerLeftVehicle') {
    const [playerId, vehicleId, seat] = args;
    emitNetPromise('playerLeftVehicle', {
      playerId,
      vehicleId,
      seat
    });
  }
});

// Vehicle damage monitoring
setInterval(() => {
  const playerPed = PlayerPedId();
  const vehicle = GetVehiclePedIsIn(playerPed, false);
  
  if (vehicle !== 0) {
    const health = GetEntityHealth(vehicle);
    const maxHealth = GetEntityMaxHealth(vehicle);
    const healthPercent = (health / maxHealth) * 100;
    
    if (healthPercent < 50) {
      emitNetPromise('vehicleDamaged', {
        vehicleId: vehicle,
        healthPercent
      });
    }
  }
}, 2000);
```

### Job System

**Server-side** (`src/server/server.ts`):
```typescript
import { onNetPromise } from '@common/shared';

interface Job {
  id: string;
  name: string;
  salary: number;
  description: string;
}

const jobs: Job[] = [
  { id: 'police', name: 'Police Officer', salary: 1000, description: 'Maintain law and order' },
  { id: 'medic', name: 'Paramedic', salary: 800, description: 'Save lives and heal the injured' },
  { id: 'mechanic', name: 'Mechanic', salary: 600, description: 'Repair and maintain vehicles' }
];

onNetPromise<any>('getJobs', (source) => {
  return jobs;
});

onNetPromise<any>('setJob', async (source, jobId) => {
  const job = jobs.find(j => j.id === jobId);
  if (!job) {
    return { success: false, error: 'Job not found' };
  }
  
  // Update player job in database
  // await prisma.player.update({
  //   where: { serverId: source },
  //   data: { job: jobId }
  // });
  
  emitNet('jobChanged', source, job);
  return { success: true, job };
});

// Payday system
setInterval(() => {
  // Pay all players their salary
  // This would typically query the database for all players
  console.log('Payday!');
}, 60000 * 30); // Every 30 minutes
```

## Utility Functions

### Distance and Location Utilities

**Client-side** (`src/client/client.ts`):
```typescript
import { getDistanceFastNoSqrt } from '@common/utils';

// Get player position
const getPlayerPosition = (): [number, number, number] => {
  const playerPed = PlayerPedId();
  const coords = GetEntityCoords(playerPed, false);
  return [coords[0], coords[1], coords[2]];
};

// Check if player is near a location
const isNearLocation = (targetCoords: [number, number, number], maxDistance: number = 5.0): boolean => {
  const playerCoords = getPlayerPosition();
  const distance = getDistanceFastNoSqrt(playerCoords, targetCoords);
  return distance <= (maxDistance * maxDistance);
};

// Find nearest player
const getNearestPlayer = (maxDistance: number = 10.0): number | null => {
  const playerCoords = getPlayerPosition();
  let nearestPlayer: number | null = null;
  let nearestDistance = maxDistance * maxDistance;
  
  const players = GetActivePlayers();
  for (const player of players) {
    if (player === PlayerId()) continue;
    
    const targetCoords = GetEntityCoords(GetPlayerPed(player), false);
    const distance = getDistanceFastNoSqrt(playerCoords, [targetCoords[0], targetCoords[1], targetCoords[2]]);
    
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestPlayer = GetPlayerServerId(player);
    }
  }
  
  return nearestPlayer;
};
```

### Notification System

**Client-side** (`src/client/client.ts`):
```typescript
// Show notification
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  SendNUIMessage({
    action: 'showNotification',
    data: { message, type }
  });
};

// Example usage
RegisterCommand('testnotif', () => {
  showNotification('This is a test notification!', 'success');
}, false);
```

**React Notification Component** (`src/web/src/components/Notification.tsx`):
```typescript
import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification notification-${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
};

export default Notification;
```

### Data Validation

**Server-side** (`src/server/server.ts`):
```typescript
// Validate player input
const validatePlayerInput = (data: any, requiredFields: string[]): boolean => {
  for (const field of requiredFields) {
    if (!data[field]) {
      return false;
    }
  }
  return true;
};

// Sanitize string input
const sanitizeString = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};

// Example usage
onNetPromise<any>('updatePlayerName', (source, data) => {
  if (!validatePlayerInput(data, ['name'])) {
    return { success: false, error: 'Name is required' };
  }
  
  const sanitizedName = sanitizeString(data.name);
  if (sanitizedName.length < 2 || sanitizedName.length > 20) {
    return { success: false, error: 'Name must be between 2 and 20 characters' };
  }
  
  // Update player name in database
  return { success: true };
});
```

These examples provide a solid foundation for building various types of FiveM resources using the TypeScript boilerplate. Each example can be adapted and extended based on your specific needs.