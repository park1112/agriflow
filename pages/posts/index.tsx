import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types';

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const data: Post[] = await res.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (posts.length === 0) {
    return <p>생성된 포스트가 없습니다.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">게시물 목록</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="bg-white shadow-md rounded p-4 hover:bg-gray-100"
          >
            <Link href={`/posts/${post.id}`} legacyBehavior>
              <a>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p>{post.content.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500">
                  작성자: {post.authorName}
                </p>
                <p className="text-sm text-gray-500">
                  생성 시간: {new Date(post.createdAt).toLocaleString()}
                </p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Link href="/posts/new" legacyBehavior>
          <a className="bg-blue-500 text-white p-2 rounded">새 게시물 작성</a>
        </Link>
      </div>
    </div>
  );
};

export default Posts;
