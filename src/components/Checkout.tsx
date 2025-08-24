import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { ArrowLeft, Store, CreditCard, Smartphone, CheckCircle, Clock, User } from 'lucide-react';
import { type CartItem } from '../App';

interface CheckoutProps {
  items: CartItem[];
  onOrderComplete: (
    customerInfo: { name: string; phone: string; email?: string },
    paymentMethod: 'upi' | 'cash',
    upiId?: string
  ) => void;
  onBack: () => void;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

type PaymentMethod = 'upi' | 'cash';

export function Checkout({ items, onOrderComplete, onBack }: CheckoutProps) {
  const [step, setStep] = useState<'info' | 'payment' | 'review' | 'processing' | 'success'>('info');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: ''
  });

  const subtotal = items.reduce((total, item) => {
    const itemPrice = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return total + (itemPrice * item.quantity);
  }, 0);

  const handleInfoSubmit = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = () => {
    if (paymentMethod === 'upi' && !upiId) {
      return;
    }
    setStep('review');
  };

  const handlePlaceOrder = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onOrderComplete(
          {
            name: customerInfo.name,
            phone: customerInfo.phone,
            email: customerInfo.email || undefined
          },
          paymentMethod,
          paymentMethod === 'upi' ? upiId : undefined
        );
      }, 3000);
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 'info':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Customer Information</h2>
                <p className="text-slate-600 text-sm">Enter your details for store pickup</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-900">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="bg-white border-slate-300 text-slate-900"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-900">Phone Number *</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="bg-white border-slate-300 text-slate-900"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-900">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="bg-white border-slate-300 text-slate-900"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Store Information */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Store className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Store Pickup Information</h3>
              </div>
              <div className="text-sm text-slate-700 space-y-1">
                <p><strong>Store Address:</strong> Janata Footwear, Main Market Street</p>
                <p><strong>Pickup Hours:</strong> 10:00 AM - 8:00 PM</p>
                <p><strong>Ready Time:</strong> Within 2 hours of order confirmation</p>
                <p className="text-blue-600 mt-2">📱 We'll send you a pickup notification via SMS</p>
              </div>
            </div>

            <Button
              onClick={handleInfoSubmit}
              disabled={!customerInfo.name || !customerInfo.phone}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl btn-wrap btn-responsive"
            >
              Continue to Payment
            </Button>
          </motion.div>
        );

      case 'payment':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
                <p className="text-slate-600 text-sm">Choose how you'd like to pay</p>
              </div>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
              <div className="space-y-3">
                <div className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
                  }`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="upi" id="upi" className="text-blue-500" />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="upi" className="font-semibold text-slate-900 cursor-pointer">
                          UPI Payment
                        </Label>
                        <p className="text-sm text-slate-600">Pay now using UPI ID</p>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'upi' && (
                    <motion.div
                      className="mt-4 space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Label htmlFor="upiId" className="text-slate-900">UPI ID</Label>
                      <Input
                        id="upiId"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="bg-white border-slate-300 text-slate-900"
                        placeholder="yourname@paytm"
                      />
                    </motion.div>
                  )}
                </div>

                <div className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cash' ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white'
                  }`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="cash" id="cash" className="text-green-500" />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Store className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="cash" className="font-semibold text-slate-900 cursor-pointer">
                          Pay at Store
                        </Label>
                        <p className="text-sm text-slate-600">Pay when you pickup</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('info')}
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Back
              </Button>
              <Button
                onClick={handlePaymentSubmit}
                disabled={paymentMethod === 'upi' && !upiId}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold btn-wrap btn-responsive"
              >
                Review Order
              </Button>
            </div>
          </motion.div>
        );

      case 'review':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Review Order</h2>
                <p className="text-slate-600 text-sm">Confirm your order details before placing</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">Order Items</h3>
              {items.map(item => {
                const itemPrice = item.discount
                  ? item.price * (1 - item.discount / 100)
                  : item.price;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
                    <div>
                      <p className="text-slate-900 font-medium">{item.name}</p>
                      <p className="text-slate-600 text-sm">
                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                        {item.discount && <span className="text-green-600"> • {item.discount}% OFF</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      {item.discount ? (
                        <div>
                          <p className="text-slate-500 line-through text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-slate-900 font-semibold">₹{Math.round(itemTotal).toLocaleString()}</p>
                        </div>
                      ) : (
                        <p className="text-slate-900 font-semibold">₹{itemTotal.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Customer Information */}
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900">Customer Information</h3>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <p className="text-slate-900 font-medium">{customerInfo.name}</p>
                <p className="text-slate-600 text-sm">{customerInfo.phone}</p>
                {customerInfo.email && (
                  <p className="text-slate-600 text-sm">{customerInfo.email}</p>
                )}
              </div>
            </div>

            {/* Pickup Information */}
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900">Pickup Details</h3>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Store className="w-4 h-4 text-blue-600" />
                  <p className="text-blue-800 font-medium">Store Pickup</p>
                </div>
                <p className="text-slate-700 text-sm">Janata Footwear, Main Market Street</p>
                <p className="text-slate-600 text-sm">Ready within 2 hours • Open 10 AM - 8 PM</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900">Payment Method</h3>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <p className="text-slate-900 font-medium">
                  {paymentMethod === 'upi' ? 'UPI Payment' : 'Pay at Store'}
                </p>
                {paymentMethod === 'upi' && (
                  <p className="text-slate-600 text-sm">{upiId}</p>
                )}
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-2 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal ({items.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Store Pickup</span>
                <span>FREE</span>
              </div>
              <Separator className="bg-slate-200" />
              <div className="flex justify-between text-slate-900 font-bold text-lg">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('payment')}
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Back
              </Button>
              <Button
                onClick={handlePlaceOrder}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold btn-wrap btn-responsive"
              >
                Place Order
              </Button>
            </div>
          </motion.div>
        );

      case 'processing':
        return (
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 border border-blue-200">
              <Clock className="w-10 h-10 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Order...</h2>
            <p className="text-slate-600 text-center">Please wait while we confirm your order</p>
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mt-6" />
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 border border-green-200">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-slate-600 text-center mb-6">
              Your order will be ready for pickup within 2 hours
            </p>
            <div className="w-full max-w-sm space-y-3">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-800 font-semibold text-center">Order ID: #JF{Date.now().toString().slice(-6)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 justify-center text-blue-700">
                  <Store className="w-4 h-4" />
                  <span className="text-sm">We'll notify you when ready for pickup</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-slate-200 p-4 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          {step !== 'processing' && step !== 'success' && (
            <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold text-slate-900 flex-1">
            {step === 'success' ? 'Order Confirmed' : 'Checkout'}
          </h1>
        </div>
      </div>

      {/* Progress Indicator */}
      {step !== 'processing' && step !== 'success' && (
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {['info', 'payment', 'review'].map((s, index) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === s ? 'bg-red-500 text-white' :
                  ['info', 'payment', 'review'].indexOf(step) > index ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                  {['info', 'payment', 'review'].indexOf(step) > index ? '✓' : index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-2 ${['info', 'payment', 'review'].indexOf(step) > index ? 'bg-green-500' : 'bg-slate-200'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}