import { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdToken } from '../../lib/firebaseAdmin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { token } = req.body;
      const decodedToken = await verifyIdToken(token);
      res.status(200).json({ user: decodedToken });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
