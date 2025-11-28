import React from "react";
import useDriverStore from "../Zustand/DriverAuth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function NavMenu() {
    const token = useDriverStore((state) => state.token);
    const logout = useDriverStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = async () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    }

    return (
        <div className="flex flex-col md:flex-row items-center gap-6 text-gray-600 font-medium">
            <Link to={"/dashboard"}>
                <div className="hover:text-black hover:font-bold cursor-pointer transition-all">
                    Dashboard
                </div>
            </Link>
            <Link to={"/trips"}>
                <div className="hover:text-black hover:font-bold cursor-pointer transition-all">
                    Trips
                </div>
            </Link>
            <Link to={"/account"}>
                <div className="hover:text-black hover:font-bold cursor-pointer transition-all">
                    Account
                </div>
            </Link>
            {token ? (
                <div onClick={handleLogout} className="hover:text-red-500 hover:font-bold cursor-pointer transition-all">
                    Log out
                </div>
            ) : (
                <Link to={"/login"}>
                    <div className="hover:text-black hover:font-bold cursor-pointer transition-all">
                        Log in
                    </div>
                </Link>
            )}
        </div>
    );
}
