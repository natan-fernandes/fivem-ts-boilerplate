import { uuidv4 } from '../lib/uuidv4';

export const emitNetPromise = <T>(eventName: string, ...args: any[]): Promise<T> => {
  return new Promise((resolve, reject) => {
    const uniqId = uuidv4();
    const listenEventName = `${eventName}:${uniqId}`;
    
    const handleListenEvent = (data: T) => {
      removeEventListener(listenEventName, handleListenEvent);
      if (hasTimedOut) return;
      resolve(data);
    };

    let hasTimedOut = false;
    const timeout = 5000;
    setTimeout(() => {
      hasTimedOut = true;
      removeEventListener(listenEventName, handleListenEvent);
      reject(`${eventName} has timed out after ${timeout} ms`);
    }, timeout);

    onNet(listenEventName, handleListenEvent);

    emitNet(eventName, listenEventName, ...args);
  });
}
