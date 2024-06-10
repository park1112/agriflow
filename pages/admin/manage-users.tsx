import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { verifyUserRole } from '@/lib/authServer';
import { User } from '@/lib/types';
import { adminDb } from '@/lib/firebaseAdmin';

const ManageUsers = ({ initialUsers }: { initialUsers: User[] }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/updateUserRole`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, newRole }),
      });
      if (res.ok) {
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, role: newRole } : user
          )
        );
      } else {
        console.error('Error updating role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-6">Manage Users</h1>
      <div className="container mx-auto">
        <ul>
          {users.map((user) => (
            <li key={user.id} className="mb-2 flex items-center">
              <span>{user.email} - </span>
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className="ml-2 p-1 border rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <span className="ml-2">
                {user.name || 'No name'} -{' '}
                {new Date(user.createdAt).toLocaleString()}
              </span>
              <Link href={`/admin/edit-user/${user.id}`} legacyBehavior>
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
    const usersSnapshot = await adminDb.collection('users').get();
    const users = usersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        role: data.role,
        name: data.name || null, // Ensure name is not undefined
        createdAt: data.createdAt.toDate().toISOString(), // Convert Timestamp to ISO string
      };
    });

    return {
      props: {
        ...result.props,
        initialUsers: users,
      },
    };
  }

  return result;
};

export default ManageUsers;
