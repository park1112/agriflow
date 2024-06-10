import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import nookies from 'nookies';
import Link from 'next/link';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    setError(null); // 초기화
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: name,
        role: 'user',
        createdAt: serverTimestamp(),
      });

      // 토큰 생성
      const token = await user.getIdToken();
      nookies.set(undefined, 'token', token, { path: '/' });

      // 유저 페이지로 이동
      router.push('/user');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`회원가입에 실패하였습니다: ${error.message}`);
      } else {
        setError('회원가입에 실패하였습니다: 알 수 없는 오류');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">회원가입</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="이름"
        />
        <input
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="이메일"
        />
        <input
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="비밀번호"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-primary text-white p-2 rounded mb-4"
        >
          회원가입
        </button>
        <Link href="/auth/login" legacyBehavior>
          <a className="w-full bg-green-500 text-white p-2 rounded block text-center">
            로그인
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Register;
