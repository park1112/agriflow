// pages/api/users/updateName.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, verifyIdToken } from '@/lib/firebaseAdmin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { token, newName } = req.body;

  try {
    const decodedToken = await verifyIdToken(token);
    const uid = decodedToken.uid;

    // 유저 컬렉션에서 이름 업데이트
    await adminDb.collection('users').doc(uid).update({
      name: newName,
    });

    // 모든 게시물에서 작성자 이름 업데이트
    const postsSnapshot = await adminDb
      .collection('posts')
      .where('authorId', '==', uid)
      .get();
    const batch = adminDb.batch();

    postsSnapshot.forEach((doc) => {
      batch.update(doc.ref, { authorName: newName });
    });

    await batch.commit();

    res.status(200).json({ message: 'Name updated successfully' });
  } catch (error) {
    console.error('Error updating name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
