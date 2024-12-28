import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const NavBar = () => {
  const { user, logout } = useAuth0();

  return (
    <nav className="bg-[#ff4500] text-white py-4 shadow-md">
      <div className="flex justify-between items-center px-4 max-w-full">
        {/* Left Section: Home Link */}
        <div className="text-lg font-bold">
          <Link
            to="/dogs"
            className="hover:text-white transition duration-300"
          >
            Dog List
          </Link>
        </div>

        {/* Right Section: User Dropdown */}
        <div className="relative group">
          <button className="text-white font-medium transition-opacity duration-300">
            {user?.name || 'User'}
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;




