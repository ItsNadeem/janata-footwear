import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ArrowLeft, Search, Heart, ShoppingCart, Star, Grid, List, Loader2 } from 'lucide-react';
import { type Product, type ProductDiscount } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProductDetails } from './ProductDetails';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product, size?: string, discount?: number) => void;
  onAddToWishlist: (product: Product) => void;
  wishlist: Product[];
  productDiscounts: Record<string, ProductDiscount>;
  onApplyDiscount: (productId: string, discount: number) => void;
  onBack: () => void;
}

export function ProductCatalog({ products, onAddToCart, onAddToWishlist, wishlist, productDiscounts, onApplyDiscount, onBack }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const loadingTriggerRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get currently displayed products
  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery, selectedCategory]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCount(prev => prev + 6);
            setIsLoading(false);
          }, 800);
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

  const ProductListItem = ({ product }: { product: Product }) => {
    return (
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Product Card */}
        <motion.div
          className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          onClick={() => setSelectedProduct(product)}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex p-4 gap-4">
            <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.stock < 5 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0">
                  Low Stock
                </Badge>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-900 line-clamp-2 pr-2">{product.name}</h3>
                {isInWishlist(product.id) && (
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-3 h-3 text-white fill-current" />
                  </div>
                )}
              </div>

              <p className="text-red-600 font-bold text-lg mb-2">₹{product.price.toLocaleString()}</p>

              <div className="flex flex-wrap gap-1 mb-2">
                {product.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-slate-200">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                  ))}
                  <span className="text-xs text-slate-500 ml-1">4.5</span>
                </div>
                <span className="text-xs text-slate-500">{product.stock} in stock</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 p-4 pt-0">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                const discount = productDiscounts[product.id]?.discount;
                onAddToCart(product, undefined, discount);
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 btn-wrap"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist(product);
              }}
              className="border-slate-300 text-slate-600 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600 text-xs px-3"
            >
              <Heart className={`w-3 h-3 ${isInWishlist(product.id) ? 'fill-current text-pink-500' : ''}`} />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const ProductGridItem = ({ product }: { product: Product }) => {
    return (
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          onClick={() => setSelectedProduct(product)}
          whileTap={{ scale: 0.98 }}
        >
          {product.stock < 5 && (
            <Badge className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs">
              Only {product.stock} left
            </Badge>
          )}

          {isInWishlist(product.id) && (
            <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 text-white fill-current" />
            </div>
          )}

          <div className="aspect-square bg-slate-100 relative overflow-hidden">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-red-600 font-bold text-lg mb-2">₹{product.price.toLocaleString()}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-slate-200">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
              ))}
              <span className="text-xs text-slate-500 ml-1">4.5 (120)</span>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  const discount = productDiscounts[product.id]?.discount;
                  onAddToCart(product, undefined, discount);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 btn-wrap"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToWishlist(product);
                }}
                className="border-slate-300 text-slate-600 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600 text-xs"
              >
                <Heart className={`w-3 h-3 ${isInWishlist(product.id) ? 'fill-current text-pink-500' : ''}`} />
              </Button>
            </div>
          </div>
        </motion.div>
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
          <h1 className="text-xl font-bold text-slate-900 flex-1">Browse Products</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
          </div>
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

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category
                ? "bg-red-600 text-white whitespace-nowrap hover:bg-red-700"
                : "border-slate-300 text-slate-600 whitespace-nowrap hover:border-red-300 hover:text-red-600 hover:bg-red-50"}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products List/Grid */}
      <div className="p-4 pb-20">
        {displayedProducts.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className={viewMode === 'list' ? "space-y-4" : "grid grid-cols-2 gap-4"}>
              {displayedProducts.map((product) =>
                viewMode === 'list' ? (
                  <ProductListItem key={product.id} product={product} />
                ) : (
                  <ProductGridItem key={product.id} product={product} />
                )
              )}
            </div>

            {/* Loading trigger for infinite scroll */}
            {hasMore && (
              <div ref={loadingTriggerRef} className="h-10 flex justify-center items-center mt-8">
                {isLoading && (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-red-600 mr-2" />
                    <span className="text-slate-600">Loading more products...</span>
                  </>
                )}
              </div>
            )}

            {!hasMore && displayedProducts.length > 6 && (
              <div className="text-center py-8">
                <p className="text-slate-500">You've seen all products!</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Details Full Page */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-white z-50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <ProductDetails
              product={selectedProduct}
              isInWishlist={isInWishlist(selectedProduct.id)}
              productDiscount={productDiscounts[selectedProduct.id]}
              onAddToCart={(product, size, discount) => {
                onAddToCart(product, size, discount);
                setSelectedProduct(null);
              }}
              onAddToWishlist={(product) => {
                onAddToWishlist(product);
              }}
              onApplyDiscount={onApplyDiscount}
              onBack={() => setSelectedProduct(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}