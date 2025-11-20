import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    success: true,
    message: 'HarvestDirect API Test - Serverless function is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    vercel: process.env.VERCEL === '1' ? 'yes' : 'no'
  });
}
