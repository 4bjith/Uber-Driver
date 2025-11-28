import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full bg-gray-900 text-white py-8 px-6 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Uber<span className="text-green-500">Driver</span></h2>
                    <p className="text-gray-400 text-sm">
                        Empowering drivers to earn on their own terms. Join the community and start driving today.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                        <li><Link to="/trips" className="hover:text-white transition-colors">My Trips</Link></li>
                        <li><Link to="/earnings" className="hover:text-white transition-colors">Earnings</Link></li>
                        <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/cookie" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                    <div className="flex gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 text-xl transition-colors"><FaFacebook /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 text-xl transition-colors"><FaTwitter /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 text-xl transition-colors"><FaInstagram /></a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 text-xl transition-colors"><FaYoutube /></a>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} UberDriver Inc. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
