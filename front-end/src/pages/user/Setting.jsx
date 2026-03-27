import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Key, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import UpdateProfile from './../../components/user/UpdateProfile';
import UpdatePass from './../../components/user/UpdatePass';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
};

const dropdownVariants = {
  hidden: { opacity: 0, height: 0, overflow: 'hidden' },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export default function Setting() {
  const { user } = useSelector((state) => state.auth);
  const [openIndex, setOpenIndex] = useState(null);

  const closeDropdown = () => setOpenIndex(null);

  const settingItem = [
    {
      name: 'Update Profile',
      icon: User,
      component: UpdateProfile,
    },
    {
      name: 'Update Password',
      icon: Key,
      component: UpdatePass,
    },
    {
      name: 'Other Settings',
      icon: Settings,
      component: () => (
        <div className="p-6 text-center text-[#A0856A] dark:text-[#8A6A4A]">
          More settings coming soon...
        </div>
      ),
    },
  ];

  const toggleSetting = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208] p-6 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
            Settings
          </h1>
          <p className="text-[#A0856A] dark:text-[#8A6A4A]">
            Manage your account preferences
          </p>
        </motion.div>

        {/* Settings List */}
        <div className="space-y-4">
          {settingItem.map((item, index) => {
            const Icon = item.icon;
            const isOpen = openIndex === index;
            const Component = item.component;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Clickable header */}
                <button
                  onClick={() => toggleSetting(index)}
                  className="w-full flex items-center justify-between p-5 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#8B5E3C]" />
                    <span className="text-lg font-medium text-[#2C1A0E] dark:text-[#F0E6D3]">
                      {item.name}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#A0856A]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#A0856A]" />
                  )}
                </button>

                {/* Animated dropdown content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="border-t border-[#DDD0B8] dark:border-[#4A3520]"
                    >
                      {/* If Component is a React component, render it with props */}
                      {typeof Component === 'function' &&
                      Component.prototype?.isReactComponent ? (
                        <Component user={user} onClose={closeDropdown} />
                      ) : (
                        <Component user={user} onClose={closeDropdown} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
