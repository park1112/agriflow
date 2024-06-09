import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();

      // 유저 정보 가져오기
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userData = userDoc.data();

      if (!userData) {
        setError('유저 정보를 불러올 수 없습니다.');
        return;
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          token,
          author: userData.name || 'Unknown', // 작성자 이름 추가
        }),
      });

      if (!res.ok) {
        throw new Error('Error creating post');
      }

      const data = await res.json();
      router.push(`/posts/${data.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setError('게시글 작성에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">새 게시글 작성</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="제목"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="내용"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            게시글 작성
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
