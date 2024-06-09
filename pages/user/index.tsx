import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import { verifyIdToken } from '@/lib/firebaseAdmin';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface User {
  email: string;
  role: string;
  name: string;
}

interface UserPageProps {
  user: User | null;
}

const UserPage = ({ user }: UserPageProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    nookies.destroy(null, 'token', { path: '/' });
    router.push('/auth/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">
            유저 정보를 불러올 수 없습니다.
          </h1>
          <Link href="/auth/login" legacyBehavior>
            <a className="w-full bg-primary text-white p-2 rounded block text-center">
              로그인 페이지로 이동
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-6">User Dashboard</h1>
      <div className="container mx-auto">
        <p>Welcome, {user.email}</p>
        {user.role === 'admin' && (
          <Link href="/admin" legacyBehavior>
            <a className="block bg-primary text-white p-4 rounded mb-4">
              Admin Page
            </a>
          </Link>
        )}
        <Link href="/user/edit" legacyBehavior>
          <a className="block bg-primary text-white p-4 rounded mb-4">
            Edit Profile
          </a>
        </Link>
        <Link href="/user/posts" legacyBehavior>
          <a className="block bg-primary text-white p-4 rounded mb-4">
            My Posts
          </a>
        </Link>
        <button
          onClick={handleLogout}
          className="block bg-red-500 text-white p-4 rounded mb-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    console.log('UID:', uid);

    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      console.log('User data not found.');
      return { props: { user: null } };
    }

    const userData = userDoc.data();
    console.log('User Data:', userData);

    return {
      props: {
        user: {
          email: userData?.email || '',
          role: userData?.role || '',
          name: userData?.name || '',
        },
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    context.res.writeHead(302, { Location: '/auth/login' });
    context.res.end();
    return { props: { user: null } };
  }
};

export default UserPage;
