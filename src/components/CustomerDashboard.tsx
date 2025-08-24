import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Package, Star, TrendingUp, Gift, Zap, Percent, Copy, Sparkles } from 'lucide-react';
import { type Screen } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CustomerDashboardProps {
  onNavigate: (screen: Screen) => void;
  cartItemCount: number;
  wishlistCount: number;
}

export function CustomerDashboard({ onNavigate, cartItemCount, wishlistCount }: CustomerDashboardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // Featured footwear for the banner - enhanced with pricing and ratings
  const bannerProducts = [
    {
      id: '1',
      name: 'Classic Sports Sneakers',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      category: 'Sneakers',
      price: 2499,
      originalPrice: 2799,
      rating: 4.8,
      badge: 'Bestseller',
      badgeColor: 'bg-green-500'
    },
    {
      id: '3',
      name: 'Running Shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      category: 'Sports',
      price: 3499,
      rating: 4.7,
      badge: 'Popular',
      badgeColor: 'bg-blue-500'
    },
    {
      id: '6',
      name: 'Elegant Heels',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
      category: 'Formal',
      price: 3299,
      rating: 4.9,
      badge: 'Premium',
      badgeColor: 'bg-purple-500'
    },
    {
      id: '7',
      name: 'Hiking Boots',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
      category: 'Boots',
      price: 5499,
      originalPrice: 5999,
      rating: 4.8,
      badge: '15% Off',
      badgeColor: 'bg-red-500'
    },
    {
      id: '8',
      name: 'Canvas Sneakers',
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
      category: 'Casual',
      price: 1899,
      rating: 4.6,
      badge: 'Budget Pick',
      badgeColor: 'bg-orange-500'
    },
    {
      id: '12',
      name: 'Chelsea Boots',
      image: 'https://images.unsplash.com/photo-1608256246200-53e8b47b2db8?w=400&h=400&fit=crop',
      category: 'Boots',
      price: 4199,
      rating: 4.7,
      badge: 'Trending',
      badgeColor: 'bg-pink-500'
    },
    {
      id: '13',
      name: 'Minimalist Sneakers',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
      category: 'Modern',
      price: 2899,
      rating: 4.8,
      badge: 'New',
      badgeColor: 'bg-indigo-500'
    },
    {
      id: '2',
      name: 'Formal Leather Shoes',
      image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop',
      category: 'Formal',
      price: 3999,
      rating: 4.9,
      badge: 'Premium',
      badgeColor: 'bg-purple-500'
    },
    {
      id: '11',
      name: 'Athletic Running Shoes',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
      category: 'Sports',
      price: 3799,
      rating: 4.8,
      badge: 'Pro Choice',
      badgeColor: 'bg-cyan-500'
    },
    {
      id: '15',
      name: 'Summer Sandals',
      image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',
      category: 'Summer',
      price: 1599,
      rating: 4.5,
      badge: 'Seasonal',
      badgeColor: 'bg-yellow-500'
    }
  ];

  // Duplicate the array for seamless loop
  const loopingProducts = [...bannerProducts, ...bannerProducts];

  // Auto-scroll effect with pause capability
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isCarouselPaused) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Slightly slower for better visibility
    const itemWidth = 180; // Width of each item including margin - wider for new cards
    const totalWidth = bannerProducts.length * itemWidth;

    const scroll = () => {
      if (isCarouselPaused) return;

      scrollPosition += scrollSpeed;

      // Reset position when we've scrolled through one complete set
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [bannerProducts.length, isCarouselPaused]);

  // Handle carousel touch interactions
  const handleCarouselTouch = () => {
    setIsCarouselPaused(true);
    // Resume after 3 seconds of no interaction
    setTimeout(() => {
      setIsCarouselPaused(false);
    }, 3000);
  };

  // Handle product click to navigate to details
  const handleProductClick = (productId: string) => {
    // Store the selected product ID in sessionStorage so ProductCatalog can handle it
    sessionStorage.setItem('selectedProductId', productId);
    onNavigate('catalog');
  };

  const dealCategories = [
    {
      icon: Percent,
      title: '10% Off',
      description: 'Limited time discount',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      bgGradient: 'from-green-50 to-green-100',
      products: [
        {
          id: '1',
          name: 'Classic Sports Sneakers',
          originalPrice: 2499,
          discountPrice: 2249,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
        },
        {
          id: '7',
          name: 'Hiking Boots',
          originalPrice: 5499,
          discountPrice: 4949,
          image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop'
        }
      ]
    },
    {
      icon: Copy,
      title: 'BOGO',
      description: 'Buy one, get one free',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      products: [
        {
          id: '8',
          name: 'Canvas Sneakers',
          originalPrice: 1899,
          discountPrice: 1899,
          image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop'
        },
        {
          id: '15',
          name: 'Summer Sandals',
          originalPrice: 1599,
          discountPrice: 1599,
          image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop'
        }
      ]
    },
    {
      icon: Sparkles,
      title: 'New Arrivals',
      description: 'Fresh styles just in',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      products: [
        {
          id: '13',
          name: 'Minimalist Sneakers',
          originalPrice: 2899,
          discountPrice: 2899,
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop'
        },
        {
          id: '12',
          name: 'Chelsea Boots',
          originalPrice: 4199,
          discountPrice: 4199,
          image: 'https://images.unsplash.com/photo-1608256246200-53e8b47b2db8?w=400&h=400&fit=crop'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20"> {/* Added bottom padding for fixed nav */}
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-red-50 p-6 pb-0">
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-700 font-medium text-sm">Welcome to Janata Footwear</span>
            </motion.div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Your Perfect Fit</h1>
            <p className="text-slate-600">Quality footwear for every step of your journey</p>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Featured Collection Section */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-red-50 px-6 pb-8">
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-slate-900 font-bold text-xl">Featured Collection</h3>
              <p className="text-slate-600 text-sm">Premium footwear selection</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500 text-white text-xs animate-pulse">
                Hot
              </Badge>
              <Badge className="bg-green-500 text-white text-xs">
                New
              </Badge>
            </div>
          </div>

          {/* Premium Product Cards Carousel */}
          <div className="relative rounded-2xl p-1">
            {/* Enhanced Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-12 carousel-gradient-left z-10 pointer-events-none rounded-l-2xl" />
            <div className="absolute right-0 top-0 bottom-0 w-12 carousel-gradient-right z-10 pointer-events-none rounded-r-2xl" />

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-hidden pb-2"
              style={{ scrollBehavior: 'auto' }}
              onTouchStart={handleCarouselTouch}
              onMouseDown={handleCarouselTouch}
            >
              {loopingProducts.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="flex-shrink-0"
                >
                  <Card
                    className="w-40 bg-white border border-slate-200 shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Badge */}
                        <Badge className={`absolute top-2 left-2 ${product.badgeColor} text-white text-xs px-2 py-1 shadow-lg`}>
                          {product.badge}
                        </Badge>

                        {/* Stock Indicator - Always Visible */}
                        <div className="absolute bottom-2 left-2">
                          <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-slate-700 font-medium">In Stock</span>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-3">
                        <div className="mb-2">
                          <h4 className="font-semibold text-slate-900 text-sm line-clamp-1 mb-1">
                            {product.name}
                          </h4>
                          <p className="text-slate-500 text-xs uppercase tracking-wide">
                            {product.category}
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-slate-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-slate-700 text-xs font-medium">
                            {product.rating}
                          </span>
                          <span className="text-slate-400 text-xs">
                            (4.2k)
                          </span>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 font-bold text-sm">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-slate-400 line-through text-xs">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Discount Percentage */}
                        {product.originalPrice && (
                          <div className="mt-1">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full">
                              <TrendingUp className="w-3 h-3 text-green-600" />
                              <span className="text-green-700 text-xs font-medium">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Tap to view hint */}
          <div className="text-center mt-6">
            <p className="text-slate-600 text-sm">
              👆 Tap any item to view details
            </p>
          </div>
        </motion.div>
      </div>

      {/* Deals Section */}
      <div className="p-6">
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Deals</h2>
            <p className="text-slate-600 text-sm">Don't miss out on these amazing offers</p>
          </div>

          <div className="space-y-6">
            {dealCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (categoryIndex + 6), duration: 0.3 }}
              >
                <Card className={`bg-gradient-to-br ${category.bgGradient} border-slate-200`}>
                  <CardContent className="p-4">
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 ${category.iconBg} rounded-xl flex items-center justify-center`}>
                        <category.icon className={`w-5 h-5 ${category.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{category.title}</h3>
                        <p className="text-xs text-slate-600">{category.description}</p>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="grid grid-cols-2 gap-3">
                      {category.products.map((product, productIndex) => (
                        <motion.div
                          key={product.id}
                          className="bg-white rounded-xl p-3 border border-slate-200 cursor-pointer hover:shadow-sm transition-shadow"
                          onClick={() => onNavigate('catalog')}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="aspect-square bg-slate-100 rounded-lg mb-2 overflow-hidden">
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <h4 className="font-medium text-slate-900 text-xs mb-1 line-clamp-2">
                            {product.name}
                          </h4>

                          <div className="flex items-center gap-1">
                            {category.title === '10% Off' ? (
                              <>
                                <span className="text-red-600 font-bold text-sm">
                                  ₹{product.discountPrice.toLocaleString()}
                                </span>
                                <span className="text-slate-400 line-through text-xs">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                              </>
                            ) : category.title === 'BOGO' ? (
                              <div className="text-xs">
                                <span className="text-slate-900 font-bold">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                                <div className="text-purple-600 font-medium">
                                  +1 FREE
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="text-slate-900 font-bold text-sm">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                                <Badge className="bg-orange-500 text-white text-xs px-1 py-0">
                                  NEW
                                </Badge>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* View More Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('catalog')}
                      className="w-full mt-3 text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    >
                      View All {category.title} →
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="p-6">
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 text-white">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Start Shopping</h3>
              <p className="text-red-100 mb-6 text-sm">Discover our exclusive collection of premium footwear</p>
              <Button
                onClick={() => onNavigate('catalog')}
                className="w-full bg-white text-red-600 hover:bg-red-50 font-semibold btn-wrap btn-responsive"
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}