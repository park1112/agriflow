// pages/admin/manage-posts.tsx
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Link from 'next/link';

import { adminDb } from '../../lib/firebaseAdmin';
import { verifyUserRole } from '@/lib/authServer';

interface Post {
  id: string;
  title: string;
  author: string;
}

interface ManagePostsProps {
  posts: Post[];
}

const ManagePosts = ({ posts }: ManagePostsProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-6">Manage Posts</h1>
      <div className="container mx-auto">
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="mb-2">
              {post.title} - {post.author}
              <Link href={`/admin/edit-post/${post.id}`} legacyBehavior>
                <a className="text-blue-500 ml-4">Edit</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await verifyUserRole(context, 'admin');

  if (result.props) {
    // Fetch posts on the server-side
    const postsSnapshot = await adminDb.collection('posts').get();
    const postsData = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      author: doc.data().author,
    }));

    return {
      props: {
        ...result.props,
        posts: postsData,
      },
    };
  }

  return result;
};

export default ManagePosts;
