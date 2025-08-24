import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Heart, ShoppingCart, Star, Trash2, Eye } from 'lucide-react';
import { type Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WishlistProps {
  items: Product[];
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onBack: () => void;
}

export function Wishlist({ items, onAddToCart, onViewProduct, onRemoveFromWishlist, onBack }: WishlistProps) {
  const ItemCard = ({ item, index }: { item: Product; index: number }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {item.stock < 5 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0">
                  Low Stock
                </Badge>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">{item.name}</h3>
              <p className="text-red-600 font-bold text-lg mb-2">₹{item.price.toLocaleString()}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-slate-200">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                ))}
                <span className="text-xs text-slate-500 ml-1">4.5</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onViewProduct(item)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 btn-wrap"
                  disabled={item.stock === 0}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {item.stock === 0 ? 'Out of Stock' : 'View Details'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveFromWishlist(item)}
                  className="border-slate-300 text-slate-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-xs px-3"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const EmptyWishlist = () => (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="w-12 h-12 text-pink-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
      <p className="text-slate-600 mb-8">Save your favorite footwear for later</p>
      <Button
        onClick={onBack}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 btn-wrap btn-responsive"
      >
        Discover Products
      </Button>
    </motion.div>
  );

  const WishlistActions = () => (
    <div className="p-4 space-y-3">
      <Card className="bg-gradient-to-r from-pink-50 to-red-50 border-pink-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600 fill-current" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-pink-800">Quick Actions</h4>
              <p className="text-sm text-pink-700">Manage your saved items</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => {
            items.forEach(item => {
              if (item.stock > 0) {
                onViewProduct(item);
              }
            });
          }}
          disabled={items.every(item => item.stock === 0)}
          className="border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 btn-wrap"
        >
          <Eye className="w-4 h-4 mr-2" />
          View All
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            items.forEach(item => onRemoveFromWishlist(item));
          }}
          className="border-slate-300 text-slate-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 btn-wrap"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-slate-200 p-4 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-900 flex-1">My Wishlist</h1>
          {items.length > 0 && (
            <Badge className="bg-pink-100 text-pink-700 border-pink-200">
              {items.length} items
            </Badge>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-4">
          <EmptyWishlist />
        </div>
      ) : (
        <>
          {/* Quick Actions */}
          <WishlistActions />

          {/* Wishlist Items */}
          <div className="p-4 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <ItemCard key={item.id} item={item} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {/* Summary Section */}
          {items.length > 0 && (
            <div className="p-4">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-900 mb-2">Wishlist Summary</h3>
                    <div className="flex justify-center gap-6 text-sm text-slate-600">
                      <div className="text-center">
                        <div className="font-semibold text-lg text-slate-900">{items.length}</div>
                        <div>Total Items</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg text-slate-900">
                          {items.filter(item => item.stock > 0).length}
                        </div>
                        <div>In Stock</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg text-red-600">
                          ₹{items.reduce((total, item) => total + item.price, 0).toLocaleString()}
                        </div>
                        <div>Total Value</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}