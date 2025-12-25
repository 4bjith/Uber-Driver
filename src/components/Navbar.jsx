import { FaUserCircle } from 'react-icons/fa';
import { HiMenu, HiX } from "react-icons/hi";
import NavMenu from './NavMenu';
import useDriverStore from '../Zustand/DriverAuth';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import api from '../api/axiosClint';

const Navbar = () => {
  const token = useDriverStore((state) => state.token);
  const [driver, setDriver] = useState({});
  const [isOpen, setIsOpen] = useState(false);  // <-- Mobile menu state

  const { data } = useQuery({
    queryKey: ["driver"],
    queryFn: async () => {
      const response = await api.get("/driver", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.driver;
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (data) setDriver(data);
  }, [data]);

  return (
    <>
      {/* Navbar */}
      <nav className="w-full h-[12vh] bg-white shadow-md flex items-center justify-between px-4 md:px-8 z-20 relative">
        
        {/* Brand */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-black">
            Driver@<span className="text-green-500">Voyago</span>
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <NavMenu />
          </div>

          {/* User Icon */}
          <div className="hidden md:flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-all">
            <FaUserCircle className="text-3xl text-gray-600" />
            <span className="font-medium text-gray-700">
              {driver?.name || "Driver"}
            </span>
          </div>

          {/* Hamburger Button for Mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <HiX className="text-3xl text-gray-700" />
            ) : (
              <HiMenu className="text-3xl text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden w-full bg-white shadow-md px-4 py-4 animate-slideDown absolute z-50">
          <NavMenu />

          {/* Mobile User Info */}
          <div className="mt-4 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <FaUserCircle className="text-3xl text-gray-600" />
            <span className="font-medium text-gray-700">
              {driver?.name || "Driver"}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
