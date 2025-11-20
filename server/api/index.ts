import type { VercelRequest, VercelResponse } from '@vercel/node';

let app: any = null;

async function getApp() {
  if (!app) {
    // Dynamically import to avoid initialization issues
    const module = await import('../src/index');
    app = module.default;
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
