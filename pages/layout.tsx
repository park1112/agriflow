'use client';

import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={inter.className}>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold">MyApp</div>
          <div>
            <Link href="/user" legacyBehavior>
              <a className="text-gray-300 hover:text-white mr-4">User</a>
            </Link>
            <Link href="/admin" legacyBehavior>
              <a className="text-gray-300 hover:text-white">Admin</a>
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
