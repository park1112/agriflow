import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../lib/firebase';

const MyPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!auth.currentUser) {
        router.push('/auth/login');
        return;
      }

      try {
        const token = await auth.currentUser.getIdToken();

        const res = await fetch(`/api/posts/myposts`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Error fetching posts');
        }

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [router]);

  if (loading) {
    return <p>로딩중...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">내 게시글</h1>
      {posts.length === 0 ? (
        <p>생성된 게시물이 없습니다.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="mb-4">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p>{post.content}</p>
              <p className="text-sm text-gray-500">작성자: {post.authorName}</p>
              <p className="text-sm text-gray-500">
                작성일: {new Date(post.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPosts;
