import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const currentState = {
    status: 'ok',
    timestamp: Date.now(),
    origin: 'vercel',
  };
  res.status(200).json(currentState);
}