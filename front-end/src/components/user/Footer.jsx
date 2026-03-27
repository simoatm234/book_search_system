import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Github, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2C1A0E] text-[#EDE4D3] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-[#C9A87C]" />
              <span className="text-3xl font-bold tracking-tight">
                BookForYou
              </span>
            </div>
            <p className="text-[#A0856A] max-w-md">
              Your personal digital library. Discover, read, and collect
              thousands of free classic books from around the world.
            </p>

            <div className="flex items-center gap-2 mt-6 text-[#A0856A]">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for book lovers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-[#C9A87C]">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/user/home"
                  className="hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/user/books"
                  className="hover:text-white transition-colors"
                >
                  My Books
                </Link>
              </li>
              <li>
                <Link
                  to="/user/library"
                  className="hover:text-white transition-colors"
                >
                  My Library
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="hover:text-white transition-colors"
                >
                  Search Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-[#C9A87C]">
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://gutendex.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Gutendex API
                </a>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#4A3520] flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[#A0856A]">
          <p>© {currentYear} BookForYou. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#C9A87C] transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-[#C9A87C] transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-[#C9A87C] transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>

          <p className="text-xs">
            Powered by <span className="text-[#C9A87C]">React + Laravel</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
