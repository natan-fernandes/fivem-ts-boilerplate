import { PrismaClient } from '@prisma/client';
import { onNetPromise } from '@common/server';

const prisma = new PrismaClient(); 

onNetPromise<string>('test', (source, message) => {
  const response: string = `This was called by ${source} with the following message: ${message}`
  return response;
});
