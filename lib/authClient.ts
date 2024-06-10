import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const getUserRole = async (userId: string): Promise<string> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) {
    throw new Error('User data not found.');
  }
  return userDoc.data()?.role || 'user';
};
