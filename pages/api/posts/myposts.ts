import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, verifyIdToken } from '@/lib/firebaseAdmin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await verifyIdToken(token);
      const uid = decodedToken.uid;

      const postsSnapshot = await adminDb
        .collection('posts')
        .where('authorId', '==', uid)
        .orderBy('createdAt', 'desc')
        .get();
      const posts = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate().toISOString(),
      }));

      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
