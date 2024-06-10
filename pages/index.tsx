import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserRole } from '../lib/authClient';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const role = await getUserRole(user.uid);
          if (role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/user');
          }
        } catch (error) {
          console.error('Error getting user role: ', error);
          router.push('/auth/login');
        }
      } else {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to Home Page</h1>
    </div>
  );
};

export default HomePage;
