
import { FaUserCircle } from 'react-icons/fa';
import NavMenu from './NavMenu';

const Navbar = () => {
    return (
        <nav className="w-full h-[12vh] bg-white shadow-md flex items-center justify-between px-4 md:px-8 z-10 relative">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-black">Driver@<span className="text-green-500">Voyago</span></h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:block">
                    <NavMenu />
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-all">
                    <FaUserCircle className="text-3xl text-gray-600" />
                    <span className="hidden md:block font-medium text-gray-700">Driver</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
