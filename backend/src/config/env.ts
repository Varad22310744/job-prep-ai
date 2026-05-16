import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || '5000',
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://Varad27:Varad%4027@cluster0.tesmbdf.mongodb.net/?appName=Cluster0',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretjwtkey',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyCUuLfxuwA19ILtBjuWTZFUlPe1y7tA0JA',
};