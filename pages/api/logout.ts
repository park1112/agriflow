import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDb } from '../../lib/firebaseAdmin';
import nookies from 'nookies';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const cookies = nookies.get({ req });
      const token = cookies.token;

      // 쿠키 삭제
      nookies.destroy({ res }, 'token', { path: '/' });

      res.status(200).json({ message: 'Logged out and user data deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to logout and delete user data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
