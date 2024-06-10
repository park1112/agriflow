// pages/api/posts/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, verifyIdToken } from '@/lib/firebaseAdmin';
import admin from 'firebase-admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { title, content, token, author } = req.body;

    try {
      const decodedToken = await verifyIdToken(token);
      const uid = decodedToken.uid;

      const newPost = {
        title,
        content,
        authorName: author,
        authorId: uid,
        createdAt: admin.firestore.Timestamp.now(),
      };

      const postRef = await adminDb.collection('posts').add(newPost);
      res.status(200).json({ id: postRef.id, ...newPost });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const postsSnapshot = await adminDb
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .get();
      const posts = postsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          authorName: data.authorName,
          createdAt: data.createdAt?.toDate().toISOString(),
        };
      });
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
