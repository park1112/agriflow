import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { adminDb } from '@/lib/firebaseAdmin';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { verifyIdToken } from '@/lib/firebaseAdmin';

interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
}

const EditPostPage = ({ post }: { post: Post | null }) => {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!post) {
      router.push('/posts');
    }
  }, [post, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);

    try {
      const postRef = doc(db, 'posts', post?.id!);
      await updateDoc(postRef, {
        title,
        content,
      });

      router.push(`/posts/${post?.id}`);
    } catch (error) {
      console.error('Error updating document: ', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>
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
            disabled={loading}
          >
            {loading ? '수정 중...' : '수정'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const postDoc = await adminDb.collection('posts').doc(id).get();

    if (!postDoc.exists) {
      return {
        props: { post: null },
      };
    }

    const postData = postDoc.data();

    if (!postData) {
      return {
        props: { post: null },
      };
    }

    const post = {
      id: postDoc.id,
      title: postData.title || '',
      content: postData.content || '',
      authorName: postData.authorName || 'Unknown',
      createdAt: postData.createdAt.toDate().toISOString(),
    };

    return {
      props: { post },
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      props: { post: null },
    };
  }
};

export default EditPostPage;
