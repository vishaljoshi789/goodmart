import Link from "next/link";
import React from "react";

const Sidebar: React.FC = () => {
  let options = [{ Home: "/securepanel/" }, { Users: "/securepanel/users/" }];
  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white">
      <div className="p-4 font-bold text-xl">
        <Link href="/securepanel">Admin Dashboard</Link>
      </div>
      <ul className="mt-6">
        {options.map((option, index) => (
          <Link href={Object.values(option)[0]} key={index}>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
              {Object.keys(option)[0]}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
