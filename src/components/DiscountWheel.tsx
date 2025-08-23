import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Zap, RotateCcw, CheckCircle, Sparkles, Target, Gift } from 'lucide-react';

interface DiscountWheelProps {
  productId: string;
  originalPrice: number;
  onDiscountApplied: (productId: string, discount: number) => void;
  onClose: () => void;
}

interface DiscountState {
  productId: string;
  attemptsUsed: number;
  currentDiscount: number | null;
  acceptedDiscount: number | null;
  isSpinning: boolean;
}

// Slot machine numbers for animation
const SLOT_NUMBERS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

// Generate random discount between 5-30%
const generateRandomDiscount = (): number => {
  return Math.floor(Math.random() * 26) + 5; // 5-30%
};

export function DiscountWheel({ productId, originalPrice, onDiscountApplied, onClose }: DiscountWheelProps) {
  const [discountState, setDiscountState] = useState<DiscountState>({
    productId,
    attemptsUsed: 0,
    currentDiscount: null,
    acceptedDiscount: null,
    isSpinning: false
  });

  const [spinNumbers, setSpinNumbers] = useState<number[]>([5, 5, 5]);
  const [showCelebration, setShowCelebration] = useState(false);

  const maxAttempts = 3;
  const remainingAttempts = maxAttempts - discountState.attemptsUsed;
  const canSpin = remainingAttempts > 0 && !discountState.acceptedDiscount && !discountState.isSpinning;

  const handleSpin = () => {
    if (!canSpin) return;

    setDiscountState(prev => ({ ...prev, isSpinning: true, currentDiscount: null }));
    setShowCelebration(false);

    // Slot machine animation
    const animationDuration = 2000;
    const intervalDuration = 100;
    let elapsed = 0;

    const spinInterval = setInterval(() => {
      setSpinNumbers([
        SLOT_NUMBERS[Math.floor(Math.random() * SLOT_NUMBERS.length)],
        SLOT_NUMBERS[Math.floor(Math.random() * SLOT_NUMBERS.length)],
        SLOT_NUMBERS[Math.floor(Math.random() * SLOT_NUMBERS.length)]
      ]);
      
      elapsed += intervalDuration;
      
      if (elapsed >= animationDuration) {
        clearInterval(spinInterval);
        
        // Generate final discount
        const finalDiscount = generateRandomDiscount();
        const finalDiscountArray = finalDiscount.toString().split('').map(Number);
        
        // Pad with zeros if needed
        while (finalDiscountArray.length < 3) {
          finalDiscountArray.unshift(0);
        }
        
        setSpinNumbers(finalDiscountArray);
        
        setTimeout(() => {
          setDiscountState(prev => ({
            ...prev,
            isSpinning: false,
            currentDiscount: finalDiscount,
            attemptsUsed: prev.attemptsUsed + 1
          }));
          setShowCelebration(true);
        }, 500);
      }
    }, intervalDuration);
  };

  const handleAcceptDiscount = () => {
    if (discountState.currentDiscount) {
      setDiscountState(prev => ({ ...prev, acceptedDiscount: discountState.currentDiscount }));
      onDiscountApplied(productId, discountState.currentDiscount);
    }
  };

  const handleTryAgain = () => {
    setDiscountState(prev => ({ ...prev, currentDiscount: null }));
    setShowCelebration(false);
  };

  const discountedPrice = discountState.currentDiscount 
    ? originalPrice - (originalPrice * discountState.currentDiscount / 100)
    : originalPrice;

  const finalDiscountedPrice = discountState.acceptedDiscount
    ? originalPrice - (originalPrice * discountState.acceptedDiscount / 100)
    : originalPrice;

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Discount Wheel Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Target className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-slate-900">Find Your Discount</h3>
          <Zap className="w-5 h-5 text-yellow-500" />
        </div>
        <p className="text-slate-600 text-sm">
          Spin to reveal your exclusive discount!
        </p>
      </div>

      {/* Attempts Counter */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-slate-600">Chances left:</span>
        <div className="flex gap-1">
          {Array.from({ length: maxAttempts }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index < remainingAttempts 
                  ? 'bg-green-500' 
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <Badge variant="outline" className="ml-2 text-xs">
          {remainingAttempts}/{maxAttempts}
        </Badge>
      </div>

      {/* Slot Machine */}
      <div className="w-full">
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-1 rounded-2xl">
          <div className="bg-white p-4 rounded-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              {/* Slot Machine Display */}
              <div className="flex gap-1">
                {spinNumbers.map((number, index) => (
                  <motion.div
                    key={`${index}-${number}`}
                    className="w-12 h-16 bg-slate-900 rounded-lg flex items-center justify-center border-2 border-yellow-500 relative overflow-hidden"
                    animate={discountState.isSpinning ? {
                      rotateX: [0, 360],
                      scale: [1, 1.05, 1]
                    } : {}}
                    transition={{
                      duration: 0.3,
                      repeat: discountState.isSpinning ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-lg font-bold text-yellow-400">
                      {number}
                    </span>
                    {discountState.isSpinning && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-transparent via-yellow-400/30 to-transparent"
                        animate={{ y: ['-100%', '100%'] }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    )}
                  </motion.div>
                ))}
                <div className="flex items-center ml-2">
                  <span className="text-xl font-bold text-slate-900">%</span>
                  <span className="text-xs text-slate-600 ml-1">OFF</span>
                </div>
              </div>
            </div>

            {/* Celebration Message */}
            <AnimatePresence>
              {showCelebration && discountState.currentDiscount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="text-center mb-4"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                    <span className="text-base font-bold text-green-600">
                      🎉 You got {discountState.currentDiscount}% off!
                    </span>
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <span className="text-slate-500 line-through">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      ₹{Math.round(discountedPrice).toLocaleString()}
                    </span>
                    <span className="text-green-600 font-medium text-xs">
                      Save ₹{Math.round(originalPrice - discountedPrice).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="space-y-2">
              {!discountState.currentDiscount && !discountState.acceptedDiscount && (
                <Button
                  onClick={handleSpin}
                  disabled={!canSpin}
                  className={`w-full py-3 text-base font-bold ${
                    canSpin 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' 
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {discountState.isSpinning ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Target className="w-4 h-4" />
                      </motion.div>
                      Spinning...
                    </div>
                  ) : canSpin ? (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Find Your Discount 🎰
                    </div>
                  ) : (
                    'No attempts left'
                  )}
                </Button>
              )}

              {discountState.currentDiscount && !discountState.acceptedDiscount && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleAcceptDiscount}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Accept ✅
                  </Button>
                  {remainingAttempts > 0 && (
                    <Button
                      onClick={handleTryAgain}
                      variant="outline"
                      className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold py-3 text-sm"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Try Again 🎲
                    </Button>
                  )}
                </div>
              )}

              {discountState.acceptedDiscount && (
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-semibold">Discount Applied!</span>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-sm">Final Price:</span>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 line-through">
                          ₹{originalPrice.toLocaleString()}
                        </span>
                        <div className="text-lg font-bold text-green-600">
                          ₹{Math.round(finalDiscountedPrice).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rules */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2 text-sm">Rules:</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Each tap consumes one chance</li>
                <li>• You have 3 total attempts</li>
                <li>• Once you skip a discount, you can't get it back</li>
                <li>• Final discount will be applied at checkout</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}