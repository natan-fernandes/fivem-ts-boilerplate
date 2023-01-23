import { emitNetPromise } from '@common/shared';

RegisterCommand('test', async () => {
  const result = await emitNetPromise<string>('test', 'Hello this is a test!');
  console.debug(result);
}, false);
