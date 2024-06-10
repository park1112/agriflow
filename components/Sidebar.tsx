import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <nav>
        <ul>
          <li>
            <Link href="/user">
              <a className="block p-2 hover:bg-gray-700 rounded">Dashboard</a>
            </Link>
          </li>
          <li>
            <Link href="/user/posts">
              <a className="block p-2 hover:bg-gray-700 rounded">My Posts</a>
            </Link>
          </li>
          <li>
            <Link href="/user/edit">
              <a className="block p-2 hover:bg-gray-700 rounded">
                Edit Profile
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
