import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  LogIn,
  Library,
  TrendingUp,
  Heart,
} from 'lucide-react';

// You can replace this with your own image URL or local asset
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFAF4] via-[#F9F4ED] to-[#F5EFE6] dark:from-[#0F0A05] dark:via-[#1A1208] dark:to-[#231608] transition-colors duration-300">
      {/* Hero Banner */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        >
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4">
            Book for You
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8">
            Your personal library, curated just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/user/home')}
              className="px-8 py-3 bg-[#8B5E3C] hover:bg-[#6B3F22] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Explore Home</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-4">
            Welcome to Your Reading Journey
          </h2>
          <p className="text-lg text-[#A0856A] dark:text-[#8A6A4A] max-w-3xl mx-auto">
            Discover, read, and organize your favorite books. Whether you're a
            casual reader or a dedicated bookworm, Book for You helps you track
            your reading progress and explore new worlds.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center mx-auto mb-4">
              <Library className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-2">
              Extensive Library
            </h3>
            <p className="text-[#A0856A] dark:text-[#8A6A4A]">
              Access thousands of books across genres, from classics to modern
              bestsellers.
            </p>
          </div>

          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-2">
              Track Progress
            </h3>
            <p className="text-[#A0856A] dark:text-[#8A6A4A]">
              Log your reading, set goals, and celebrate your achievements with
              detailed insights.
            </p>
          </div>

          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-2">
              Personalized Experience
            </h3>
            <p className="text-[#A0856A] dark:text-[#8A6A4A]">
              Get recommendations based on your taste and discover hidden gems
              you'll love.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#8B5E3C] hover:bg-[#6B3F22] text-white font-semibold rounded-xl transition-all duration-200 shadow-md"
          >
            Get Started for Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-4">
            Join thousands of readers already enjoying Book for You
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#DDD0B8] dark:border-[#4A3520] py-6 text-center text-sm text-[#A0856A] dark:text-[#8A6A4A]">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Book for You. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
