import { GetServerSideProps } from 'next';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyUserRole } from '@/lib/authServer';
import React from 'react';

interface UserCount {
  [date: string]: number;
}

const AdminDashboard = ({ users }: { users: UserCount }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-6">Admin Dashboard</h1>
      <div className="container mx-auto">
        <h2 className="text-xl font-semibold mb-4">User Count by Date</h2>
        {Object.keys(users).length > 0 ? (
          <ul>
            {Object.keys(users).map((date) => (
              <li key={date} className="mb-2">
                {date}: {users[date]} users
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await verifyUserRole(context, 'admin');

  if (result.props) {
    const usersSnapshot = await adminDb.collection('users').get();
    const users: UserCount = {};

    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt) {
        const date = data.createdAt.toDate().toLocaleDateString();
        users[date] = (users[date] || 0) + 1;
      }
    });

    return {
      props: {
        users,
      },
    };
  }

  return result;
};

export default AdminDashboard;
