import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Language */}
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                   <span className="text-primary font-bold text-xl">E</span>
                </div>
                <span className="font-bold text-xl tracking-tight">EduPlatform</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-600 rounded px-3 py-2 w-fit hover:border-gray-400 cursor-pointer">
              <Globe className="h-4 w-4" />
              <span className="text-sm">English</span>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-bold text-lg mb-4">EduPlatform</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white">About us</Link></li>
              <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/investors" className="hover:text-white">Investors</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-bold text-lg mb-4">Discovery</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/courses" className="hover:text-white">Get the app</Link></li>
              <li><Link to="/instructor/dashboard" className="hover:text-white">Teach on EduPlatform</Link></li>
              <li><Link to="/affiliate" className="hover:text-white">Affiliate</Link></li>
            </ul>
          </div>

           {/* Links Column 3 */}
           <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy policy</Link></li>
              <li><Link to="/cookie" className="hover:text-white">Cookie settings</Link></li>
              <li><Link to="/sitemap" className="hover:text-white">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2025 EduPlatform, Inc.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
