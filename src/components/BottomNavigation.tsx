import React, { useCallback, useRef } from 'react';
import { Badge } from './ui/badge';
import { Package, ShoppingCart, Heart, Home, User } from 'lucide-react';
import { type Screen } from '../App';

interface BottomNavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  cartItemCount: number;
  wishlistCount: number;
  orderCount?: number;
}

export function BottomNavigation({ currentScreen, onNavigate, cartItemCount, wishlistCount, orderCount = 0 }: BottomNavigationProps) {
  const lastNavigationTime = useRef(0);
  const navigationThrottle = 150; // Minimum time between navigations in ms

  const handleNavigate = useCallback((screen: Screen) => {
    const now = Date.now();
    if (now - lastNavigationTime.current < navigationThrottle) {
      return; // Throttle rapid clicks
    }
    lastNavigationTime.current = now;
    onNavigate(screen);
  }, [onNavigate]);
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
    },
    {
      id: 'profile' as Screen,
      label: 'Profile',
      icon: User,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      activeColor: 'bg-purple-500',
      count: orderCount
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-3 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-100 ${isActive ? 'scale-105' : 'scale-100 hover:scale-102'
                }`}
            >
              {/* Icon Container */}
              <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-100 ${isActive
                ? `${item.activeColor} shadow-lg`
                : `${item.bgColor} hover:${item.activeColor.replace('bg-', 'hover:bg-')}`
                }`}>
                <Icon className={`w-6 h-6 transition-all duration-75 ${isActive ? 'text-white' : item.color
                  }`} />

                {/* Simple Badge for counts */}
                {item.count > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <span className="text-white text-xs font-bold leading-none">
                        {item.count > 99 ? '99+' : item.count}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Label */}
              <span className={`text-xs mt-1 font-medium transition-all duration-75 ${isActive ? 'text-slate-900' : 'text-slate-600'
                }`}>
                {item.label}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-red-500 rounded-full" />
              )}

              {/* Badge Count Text for Screen Reader */}
              {item.count > 0 && (
                <span className="sr-only">
                  {item.count} {item.label.toLowerCase()} items
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Safe area for iPhone home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  );
}