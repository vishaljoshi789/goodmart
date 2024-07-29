import React from "react";

const MainContent: React.FC = () => {
  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-4">
          Welcome to the Admin Dashboard
        </h1>
        <p>
          This is your main content area where you can add your widgets, charts,
          and other admin features.
        </p>
      </div>
    </div>
  );
};

export default MainContent;
