import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebaseAdmin';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { id, name, email, role } = req.body;
    try {
      await adminDb.collection('users').doc(id).update({ name, email, role });
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
