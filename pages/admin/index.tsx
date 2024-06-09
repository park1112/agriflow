import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { adminDb } from '../../lib/firebaseAdmin'; // 서버 사이드에서만 사용
import { verifyUserRole } from '@/lib/authServer';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AdminPageProps {
  userId: string;
  users: { id: string; email: string; createdAt: string }[]; // createdAt을 string으로 변경
}

const AdminPage = ({ userId, users }: AdminPageProps) => {
  const [chartData, setChartData] = useState({
    categories: [] as string[],
    series: [] as { name: string; data: number[] }[],
  });

  useEffect(() => {
    const dateUserMap = new Map<string, number>();
    users.forEach((user) => {
      const date = new Date(user.createdAt).toLocaleDateString();
      dateUserMap.set(date, (dateUserMap.get(date) || 0) + 1);
    });

    const categories = Array.from(dateUserMap.keys());
    const series = [
      {
        name: 'Users',
        data: Array.from(dateUserMap.values()),
      },
    ];
    setChartData({ categories, series });
  }, [users]);

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-6">Admin Dashboard</h1>
      <div className="container mx-auto">
        <Chart
          options={{
            chart: {
              type: 'bar',
            },
            xaxis: {
              categories: chartData.categories,
            },
          }}
          series={chartData.series}
          type="bar"
          height={320}
        />
        <h2 className="text-xl font-bold mt-6">Today's New Users</h2>
        <ul>
          {users
            .filter((user) => {
              const today = new Date().toLocaleDateString();
              const userDate = new Date(user.createdAt).toLocaleDateString();
              return today === userDate;
            })
            .map((user) => (
              <li key={user.id}>{user.email}</li>
            ))}
        </ul>
        <Link href="/admin/manage-users" legacyBehavior>
          <a className="block bg-primary text-white p-4 rounded mt-4">
            Manage Users
          </a>
        </Link>
        <Link href="/admin/manage-posts" legacyBehavior>
          <a className="block bg-primary text-white p-4 rounded mt-4">
            Manage Posts
          </a>
        </Link>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await verifyUserRole(context, 'admin');

  if (result.props) {
    // Fetch users on the server-side
    const usersSnapshot = await adminDb.collection('users').get();
    const usersData = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      email: doc.data().email,
      createdAt: doc.data().createdAt.toDate().toISOString(), // toISOString()으로 변환
    }));

    return {
      props: {
        ...result.props,
        users: usersData,
      },
    };
  }

  return result;
};

export default AdminPage;
