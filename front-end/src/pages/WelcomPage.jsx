import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ArrowRight,
  LogIn,
  Library,
  TrendingUp,
  Heart,
} from 'lucide-react';
import { useAuth } from '../Services/App/slice/Dispatches/AuthDispatch';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { setOpenAuth } = useAuth();

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    hover: {
      y: -12,
      scale: 1.02,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFAF4] dark:bg-[#0F0A05] overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
          >
            <BookOpen className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter mb-6"
          >
            Book for You
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-2xl text-white/90 mb-10 max-w-2xl mx-auto"
          >
            Your personal sanctuary for timeless stories and endless
            discoveries.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setOpenAuth();
                navigate('/user/home');
              }}
              className="group px-10 py-4 bg-[#8B5E3C] hover:bg-[#6B3F22] text-white font-semibold text-lg rounded-2xl flex items-center justify-center gap-3 shadow-xl"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="px-10 py-4 border-2 border-white/40 hover:border-white bg-white/10 backdrop-blur-md text-white font-semibold text-lg rounded-2xl flex items-center justify-center gap-3 transition-all"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-6"
          >
            Everything you need to love reading again
          </motion.h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {[
            {
              icon: <Library className="w-9 h-9" />,
              title: 'Vast Collection',
              desc: 'Thousands of free classic books, fiction, science, philosophy, and more.',
            },
            {
              icon: <TrendingUp className="w-9 h-9" />,
              title: 'Track Your Journey',
              desc: 'Keep progress, set reading goals, and celebrate every book you finish.',
            },
            {
              icon: <Heart className="w-9 h-9" />,
              title: 'Made for You',
              desc: 'Personal recommendations and a beautiful reading experience.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-3xl p-10 text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-[#2C1A0E] dark:text-[#F0E6D3] mb-4">
                {feature.title}
              </h3>
              <p className="text-[#A0856A] dark:text-[#8A6A4A] leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => navigate('/register')}
            className="px-12 py-5 bg-[#8B5E3C] hover:bg-[#6B3F22] text-white text-xl font-semibold rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl"
          >
            Join Free — Start Reading Today
          </button>
          <p className="mt-4 text-[#A0856A] dark:text-[#8A6A4A]">
            No credit card required • Instant access
          </p>
        </motion.div>
      </div>
    </div>
  );
}
