import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyUserRole } from '@/lib/authServer';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring'; // 수정된 부분

const EditUser = ({ user }: { user: any }) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const router = useRouter();

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/updateUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: user.id, name, email, role }),
      });
      if (res.ok) {
        router.push('/admin/manage-users');
      } else {
        console.error('Error updating user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Edit User</h1>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          onClick={handleUpdate}
          className="w-full bg-primary text-white p-2 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await verifyUserRole(context, 'admin');
  const { id } = context.params as ParsedUrlQuery; // Type assertion to ParsedUrlQuery

  if (result.props) {
    const userDoc = await adminDb
      .collection('users')
      .doc(id as string)
      .get();
    const userData = userDoc.data();

    if (!userData) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        ...result.props,
        user: {
          id: userDoc.id,
          name: userData.name || null, // Ensure name is not undefined
          email: userData.email || null, // Ensure email is not undefined
          role: userData.role || null, // Ensure role is not undefined
          createdAt: userData.createdAt.toDate().toISOString(),
        },
      },
    };
  }

  return result;
};

export default EditUser;
