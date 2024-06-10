// components/Layout.tsx
import { ReactNode } from 'react';
import NavBar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
};

export default Layout;
