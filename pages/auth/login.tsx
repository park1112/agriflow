// pages/auth/login.tsx
import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import nookies from 'nookies';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    emailInputRef.current?.focus();

    const checkLogin = async () => {
      try {
        const cookies = nookies.get();
        if (cookies.token) {
          const res = await fetch('/api/verifyToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: cookies.token }),
          });
          const data = await res.json();
          if (data.user) {
            if (data.user.role === 'admin') {
              router.push('/admin');
            } else {
              router.push('/user');
            }
          }
        }
      } catch (error) {
        console.log('Not logged in');
      }
    };

    checkLogin();
  }, [router]);

  const handleLogin = async () => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found.');
      }

      const token = await user.getIdToken();
      nookies.set(undefined, 'token', token, { path: '/' });

      const role = userDoc.data()?.role;
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('auth/invalid-credential')) {
          setError('ID나 비밀번호가 잘못 되었습니다. 다시 로그인 해주세요.');
        } else if (error.message.includes('auth/wrong-password')) {
          setError('비밀번호가 틀립니다.');
        } else if (error.message.includes('auth/invalid-email')) {
          setError('유효하지 않은 이메일 주소입니다.');
        } else if (error.message.includes('auth/too-many-requests')) {
          setError('잠시 후 다시 시도해주세요.');
        } else {
          setError(`로그인에 실패하였습니다: ${error.message}`);
        }
      } else {
        setError('로그인에 실패하였습니다: 알 수 없는 오류');
      }
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">로그인</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          onKeyPress={handleKeyPress}
          ref={emailInputRef}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="이메일"
        />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          onKeyPress={handleKeyPress}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="비밀번호"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-primary text-white p-2 rounded mb-4"
        >
          로그인
        </button>
        <Link href="/auth/register" legacyBehavior>
          <a className="w-full bg-green-500 text-white p-2 rounded block text-center">
            회원가입
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Login;
