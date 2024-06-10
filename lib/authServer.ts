// lib/verifyUserRole.ts
import { adminAuth, adminDb } from './firebaseAdmin';
import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

export const getUserRole = async (userId: string): Promise<string> => {
  const userDoc = await adminDb.collection('users').doc(userId).get();
  if (!userDoc.exists) {
    throw new Error('User data not found.');
  }
  return userDoc.data()?.role || 'user';
};

export const verifyUserRole = async (
  context: GetServerSidePropsContext,
  requiredRole: string
) => {
  const cookies = nookies.get(context);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    const role = await getUserRole(userId);

    if (role !== requiredRole) {
      return {
        redirect: {
          destination: requiredRole === 'admin' ? '/user' : '/auth/login',
          permanent: false,
        },
      };
    }

    return { props: { userId, role } };
  } catch (error) {
    console.error('Error verifying user role:', error);
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
};
