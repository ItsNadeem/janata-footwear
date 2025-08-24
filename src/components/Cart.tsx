import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Zap, X } from 'lucide-react';
import { type CartItem, type ProductDiscount } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DiscountWheel } from './DiscountWheel';

interface CartProps {
  items: CartItem[];
  productDiscounts: Record<string, ProductDiscount>;
  onUpdateQuantity: (productId: string, quantity: number, size?: string) => void;
  onRemoveItem: (productId: string, size?: string) => void;
  onApplyDiscount: (productId: string, discount: number) => void;
  onCheckout: () => void;
  onBack: () => void;
}

export function Cart({
  items,
  productDiscounts,
  onUpdateQuantity,
  onRemoveItem,
  onApplyDiscount,
  onCheckout,
  onBack
}: CartProps) {
  const [showDiscountWheel, setShowDiscountWheel] = useState<string | null>(null);

  const subtotal = items.reduce((total, item) => {
    const itemPrice = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return total + (itemPrice * item.quantity);
  }, 0);

  // Calculate total savings from discounts
  const totalSavings = items.reduce((savings, item) => {
    if (item.discount) {
      const discountAmount = (item.price * item.discount / 100) * item.quantity;
      return savings + discountAmount;
    }
    return savings;
  }, 0);

  const ItemCard = ({ item, index }: { item: CartItem; index: number }) => {
    const hasDiscount = productDiscounts[item.id];
    const canApplyDiscount = !item.discount && !hasDiscount;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -300 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">{item.name}</h3>

                {/* Price with discount */}
                {item.discount ? (
                  <div className="mb-2">
                    <p className="text-sm text-slate-500 line-through">₹{item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-green-600 font-bold text-lg">
                        ₹{Math.round(item.price * (1 - item.discount / 100)).toLocaleString()}
                      </p>
                      <Badge className="bg-green-500 text-white text-xs">
                        {item.discount}% OFF
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-600 font-bold text-lg mb-2">₹{item.price.toLocaleString()}</p>
                )}

                <div className="flex gap-1 mb-2 flex-wrap">
                  {item.size && (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 text-xs">
                      Size: {item.size}
                    </Badge>
                  )}
                  {item.discount && (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                      Discount Applied
                    </Badge>
                  )}
                </div>

                {/* Discount Button */}
                {canApplyDiscount && (
                  <div className="mb-3">
                    <Button
                      onClick={() => setShowDiscountWheel(item.id)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs px-3 py-1 h-7 rounded-lg"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Get Discount 🎰
                    </Button>
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.size)}
                      className="h-8 w-8 p-0 hover:bg-white text-slate-600"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-slate-900">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.size)}
                      className="h-8 w-8 p-0 hover:bg-white text-slate-600"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id, item.size)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                {item.discount ? (
                  <div>
                    <p className="text-sm text-slate-500 line-through">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="font-bold text-green-600">
                      ₹{Math.round(item.price * (1 - item.discount / 100) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const EmptyCart = () => (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="w-12 h-12 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
      <p className="text-slate-600 mb-8">Discover amazing footwear and add them to your cart</p>
      <Button
        onClick={onBack}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 btn-wrap btn-responsive"
      >
        Start Shopping
      </Button>
    </motion.div>
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-slate-200 p-4 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900 flex-1">My Cart</h1>
          </div>
        </div>

        <div className="p-4">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-slate-200 p-4 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-900 flex-1">My Cart</h1>
          <Badge className="bg-red-100 text-red-700 border-red-200">
            {items.reduce((total, item) => total + item.quantity, 0)} items
          </Badge>
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        <AnimatePresence>
          {items.map((item, index) => (
            <ItemCard key={`${item.id}-${item.size}`} item={item} index={index} />
          ))}
        </AnimatePresence>

        {/* Discount Wheel Modal */}
        <AnimatePresence>
          {showDiscountWheel && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDiscountWheel(null)}
                  className="absolute top-4 right-4 z-10 text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </Button>

                <div className="p-6">
                  <DiscountWheel
                    productId={showDiscountWheel}
                    originalPrice={items.find(item => item.id === showDiscountWheel)?.price || 0}
                    onDiscountApplied={(productId, discount) => {
                      onApplyDiscount(productId, discount);
                      setShowDiscountWheel(null);
                    }}
                    onClose={() => setShowDiscountWheel(null)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Savings Summary */}
        {totalSavings > 0 && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800">Amazing Savings!</h4>
                  <p className="text-sm text-green-700">
                    You're saving ₹{Math.round(totalSavings).toLocaleString()} with applied discounts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}



        {/* Order Summary */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Order Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal ({items.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount Savings</span>
                  <span>-₹{Math.round(totalSavings).toLocaleString()}</span>
                </div>
              )}

              <Separator className="bg-slate-200" />

              <div className="flex justify-between text-lg font-bold text-slate-900">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              {totalSavings > 0 && (
                <div className="text-center text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                  🎉 You saved ₹{Math.round(totalSavings).toLocaleString()} on this order!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Checkout Button - Now in normal flow */}
        <div className="pt-4">
          <Button
            onClick={onCheckout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl btn-wrap btn-responsive shadow-lg"
          >
            Proceed to Checkout • ₹{subtotal.toLocaleString()}
          </Button>
        </div>
      </div>
    </div>
  );
}