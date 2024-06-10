import { useState } from 'react';
import Link from 'next/link';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center relative z-50">
      <div className="text-white text-2xl">MyApp</div>
      <div className="hidden md:flex space-x-4">
        <Link href="/" legacyBehavior>
          <a className="text-white">Home</a>
        </Link>
        <Link href="/admin" legacyBehavior>
          <a className="text-white">Admin</a>
        </Link>
        <Link href="/user" legacyBehavior>
          <a className="text-white">User</a>
        </Link>
        <Link href="/posts" legacyBehavior>
          <a className="text-white">포스트생성</a>
        </Link>
        <Link href="/auth/login" legacyBehavior>
          <a className="text-white">Login</a>
        </Link>
      </div>
      <button className="md:hidden text-white" onClick={toggleNav}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      <div
        className={`fixed top-0 right-0 h-full bg-blue-500 text-white w-64 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <button className="absolute top-4 right-4" onClick={toggleNav}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <div className="flex flex-col mt-16 space-y-4">
          <Link href="/" legacyBehavior>
            <a className="text-white" onClick={toggleNav}>
              Home
            </a>
          </Link>
          <Link href="/admin" legacyBehavior>
            <a className="text-white" onClick={toggleNav}>
              Admin
            </a>
          </Link>
          <Link href="/user" legacyBehavior>
            <a className="text-white" onClick={toggleNav}>
              User
            </a>
          </Link>
          <Link href="/posts" legacyBehavior>
            <a className="text-white" onClick={toggleNav}>
              포스트생성
            </a>
          </Link>
          <Link href="/auth/login" legacyBehavior>
            <a className="text-white" onClick={toggleNav}>
              Login
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
