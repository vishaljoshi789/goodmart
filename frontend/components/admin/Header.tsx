import React from "react";

const Header: React.FC = () => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-red-500">Goodmart</div>
      <div className="flex items-center space-x-4"></div>
    </div>
  );
};

export default Header;
