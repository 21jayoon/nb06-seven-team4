import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const prismaClient = new PrismaClient;
export const imageUploadLimit = 3;
