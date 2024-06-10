import { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import PostItem from '../../components/PostItem';

type Post = {
  id: string;
  title: string;
  content: string;
};

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(
            collection(db, 'posts'),
            where('userId', '==', user.uid)
          );
          const querySnapshot = await getDocs(q);
          const postsData: Post[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];
          setPosts(postsData);
        }
      } catch (error) {
        console.error('Error fetching posts: ', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-6">My Posts</h1>
      <div className="container mx-auto">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Posts;
