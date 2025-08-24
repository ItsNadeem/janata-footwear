import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ArrowLeft, Search, Heart, ShoppingCart, Star, Eye, Zap } from 'lucide-react';
import { type Product, type ProductDiscount } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';


interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product, size?: string, discount?: number) => void;
  onAddToWishlist: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  wishlist: Product[];
  productDiscounts: Record<string, ProductDiscount>;
  onApplyDiscount: (productId: string, discount: number) => void;
  onBack: () => void;
}

export function ProductCatalog({ products, onAddToCart, onAddToWishlist, onViewProduct, wishlist, productDiscounts, onApplyDiscount, onBack }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const loadingTriggerRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products based on search and category only
  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Get currently displayed products
  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(8);
  }, [searchQuery, selectedCategory]);

  // Check for selected product from carousel on component mount
  useEffect(() => {
    const selectedProductId = sessionStorage.getItem('selectedProductId');
    if (selectedProductId) {
      const selectedProduct = products.find(p => p.id === selectedProductId);
      if (selectedProduct) {
        onViewProduct(selectedProduct);
        sessionStorage.removeItem('selectedProductId'); // Clean up
      }
    }
  }, [products, onViewProduct]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCount(prev => prev + 8);
            setIsLoading(false);
          }, 400);
        }
      },
      { threshold: 0.1 }
    );

    if (loadingTriggerRef.current) {
      observer.observe(loadingTriggerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const discount = productDiscounts[product.id]?.discount;
    onAddToCart(product, undefined, discount);
  };

  const CleanProductCard = ({ product }: { product: Product }) => {
    const hasDiscount = productDiscounts[product.id];
    const discountedPrice = hasDiscount
      ? product.price * (1 - hasDiscount.discount / 100)
      : product.price;

    return (
      <motion.div
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col h-full cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => onViewProduct(product)}
        whileHover={{ y: -2, borderColor: "rgb(220 38 38 / 0.2)" }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Product Image */}
        <div className="aspect-square bg-slate-100 relative overflow-hidden">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Action Icons - Right Side */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist(product);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${isInWishlist(product.id)
                ? 'bg-pink-500 hover:bg-pink-600'
                : 'bg-white/90 backdrop-blur-sm hover:bg-white'
                }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-white fill-current' : 'text-slate-600'}`} />
            </button>

            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewProduct(product);
              }}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
            >
              <Eye className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Discount Badge - Top Left */}
          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-green-500 text-white text-xs px-2 py-1 font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {hasDiscount.discount}% OFF
              </Badge>
            </div>
          )}

          {/* Stock Badge - Bottom Left */}
          {product.stock < 5 && product.stock > 0 && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
                Only {product.stock} left
              </Badge>
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info - Flexible Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Name */}
          <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Price with Inline Discount */}
          <div className="mb-3">
            {hasDiscount ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-lg text-green-600">
                  ₹{Math.round(discountedPrice).toLocaleString()}
                </span>
                <span className="text-sm text-slate-500 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
                <Badge className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5">
                  -{hasDiscount.discount}%
                </Badge>
              </div>
            ) : (
              <span className="font-bold text-lg text-red-600">₹{product.price.toLocaleString()}</span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
            ))}
            <span className="text-xs text-slate-500 ml-1">4.5 (120)</span>
          </div>


        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-slate-200 p-4 z-20 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-slate-900 flex-1">Browse Products</h1>
          <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-200 font-medium">
            {filteredProducts.length}
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-red-500 focus:ring-red-500/20"
          />
        </div>

        {/* Categories Only */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category
                ? "bg-red-600 text-white whitespace-nowrap hover:bg-red-700"
                : "bg-white border-slate-300 text-slate-700 whitespace-nowrap hover:border-red-300 hover:text-red-600 hover:bg-red-50"}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 pb-20">
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-600">Try adjusting your search or category</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              {displayedProducts.map((product) => (
                <CleanProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Loading more products */}
            {hasMore && (
              <div ref={loadingTriggerRef} className="h-20 flex justify-center items-center mt-8">
                {isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-600">Loading more...</span>
                  </div>
                )}
              </div>
            )}

            {!hasMore && displayedProducts.length > 8 && (
              <div className="text-center py-8">
                <p className="text-slate-500">You've seen all products!</p>
              </div>
            )}
          </>
        )}
      </div>



      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-sm w-full max-h-[70vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4">
                  <ImageWithFallback
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{quickViewProduct.name}</h3>

                {/* Price in Quick View with Inline Discount */}
                <div className="mb-3">
                  {productDiscounts[quickViewProduct.id] ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xl text-green-600">
                        ₹{Math.round(quickViewProduct.price * (1 - productDiscounts[quickViewProduct.id].discount / 100)).toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-500 line-through">
                        ₹{quickViewProduct.price.toLocaleString()}
                      </span>
                      <Badge className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5">
                        -{productDiscounts[quickViewProduct.id].discount}%
                      </Badge>
                    </div>
                  ) : (
                    <span className="font-bold text-xl text-red-600">₹{quickViewProduct.price.toLocaleString()}</span>
                  )}
                </div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{quickViewProduct.description}</p>

                {/* Size Information */}
                {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-700 font-medium mb-2">Available Sizes:</p>
                    <div className="flex flex-wrap gap-1">
                      {quickViewProduct.sizes.map(size => (
                        <Badge key={size} variant="outline" className="text-xs border-amber-300 text-amber-700">
                          {size}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-amber-600 mt-2">Select size in details page</p>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {quickViewProduct.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-slate-200">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      onViewProduct(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    disabled={quickViewProduct.stock === 0}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {quickViewProduct.stock === 0
                      ? 'Out of Stock'
                      : quickViewProduct.sizes && quickViewProduct.sizes.length > 0
                        ? 'View Details & Select Size'
                        : 'View Details & Add to Cart'
                    }
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}