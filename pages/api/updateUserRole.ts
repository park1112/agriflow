import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebaseAdmin';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { id, newRole } = req.body;
    try {
      await adminDb.collection('users').doc(id).update({ role: newRole });
      res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating role' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
