import { GetServerSideProps } from 'next';
import { adminDb } from '@/lib/firebaseAdmin';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
}

const PostPage = ({ post }: { post: Post | null }) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">
            존재하지 않는 게시물입니다.
          </h1>
          <button
            onClick={() => router.push('/posts')}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            게시물 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/posts');
      } else {
        console.error('Failed to delete the post');
        setDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="mb-4">{post.content}</p>
        <p className="text-sm text-gray-500">작성자: {post.authorName}</p>
        <p className="text-sm text-gray-500">
          작성일: {new Date(post.createdAt).toLocaleString()}
        </p>
        <div className="mt-4 flex space-x-4">
          <Link href={`/posts/edit/${post.id}`} legacyBehavior>
            <a className="bg-yellow-500 text-white p-2 rounded">수정</a>
          </Link>
          <button
            onClick={handleDelete}
            className={`bg-red-500 text-white p-2 rounded ${
              deleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={deleting}
          >
            {deleting ? '삭제 중...' : '삭제'}
          </button>
          <button
            onClick={() => router.push('/posts')}
            className="bg-blue-500 text-white p-2 rounded"
          >
            목록으로 돌아가기
          </button>
        </div>
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

export default PostPage;
