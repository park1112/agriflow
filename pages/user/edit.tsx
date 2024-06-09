// pages/user/edit.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase';
import nookies from 'nookies';

const EditProfile = () => {
  const [newName, setNewName] = useState('');
  const router = useRouter();

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch('/api/users/updateName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newName }),
      });

      if (res.ok) {
        alert('이름이 성공적으로 변경되었습니다.');
        router.push('/user');
      } else {
        alert('이름 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      alert('이름 변경에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">프로필 수정</h1>
        <form onSubmit={handleNameChange}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="새 이름"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            이름 변경
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
