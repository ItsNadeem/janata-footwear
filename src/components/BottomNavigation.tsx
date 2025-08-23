import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';
import { Package, ShoppingCart, Heart, Home } from 'lucide-react';
import { type Screen } from '../App';

interface BottomNavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  cartItemCount: number;
  wishlistCount: number;
}

export function BottomNavigation({ currentScreen, onNavigate, cartItemCount, wishlistCount }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'dashboard' as Screen,
      label: 'Home',
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      activeColor: 'bg-blue-500',
      count: 0
    },
    {
      id: 'catalog' as Screen,
      label: 'Browse',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      activeColor: 'bg-green-500',
      count: 0
    },
    {
      id: 'cart' as Screen,
      label: 'Cart',
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      activeColor: 'bg-orange-500',
      count: cartItemCount
    },
    {
      id: 'wishlist' as Screen,
      label: 'Wishlist',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      activeColor: 'bg-pink-500',
      count: wishlistCount
    }
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-3 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${isActive ? 'scale-105' : 'scale-100 hover:scale-105'
                }`}
              whileTap={{ scale: 0.95 }}
            >
              {/* Icon Container */}
              <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive
                ? `${item.activeColor} shadow-lg`
                : `${item.bgColor} hover:${item.activeColor.replace('bg-', 'hover:bg-')}`
                }`}>
                <Icon className={`w-6 h-6 transition-all duration-200 ${isActive ? 'text-white' : item.color
                  }`} />

                {/* Enhanced Badge/Bubble for counts */}
                <AnimatePresence>
                  {item.count > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="absolute -top-1 -right-1"
                    >
                      <div className="relative">
                        {/* Bubble Background */}
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <span className="text-white text-xs font-bold leading-none">
                            {item.count > 99 ? '99+' : item.count}
                          </span>
                        </div>

                        {/* Pulse Ring */}
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />

                        {/* Subtle Glow */}
                        <div className="absolute inset-0 bg-red-400 rounded-full blur-sm opacity-30" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Label */}
              <span className={`text-xs mt-1 font-medium transition-all duration-200 ${isActive ? 'text-slate-900' : 'text-slate-600'
                }`}>
                {item.label}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  className="absolute -bottom-1 w-1 h-1 bg-red-500 rounded-full"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Badge Count Text for Screen Reader */}
              {item.count > 0 && (
                <span className="sr-only">
                  {item.count} {item.label.toLowerCase()} items
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Safe area for iPhone home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </motion.div>
  );
}