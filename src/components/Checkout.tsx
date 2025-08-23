import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { ArrowLeft, MapPin, CreditCard, Smartphone, Truck, CheckCircle, Clock } from 'lucide-react';
import { type CartItem } from '../App';

interface CheckoutProps {
  items: CartItem[];
  onOrderComplete: () => void;
  onBack: () => void;
}

interface Address {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
}

type PaymentMethod = 'upi' | 'cod';

export function Checkout({ items, onOrderComplete, onBack }: CheckoutProps) {
  const [step, setStep] = useState<'address' | 'payment' | 'review' | 'processing' | 'success'>('address');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [address, setAddress] = useState<Address>({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    pincode: ''
  });

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 1000 ? 0 : 99;
  const total = subtotal + deliveryFee;

  const handleAddressSubmit = () => {
    if (!address.name || !address.phone || !address.addressLine1 || !address.city || !address.pincode) {
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
        onOrderComplete();
      }, 3000);
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 'address':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Delivery Address</h2>
                <p className="text-gray-400 text-sm">Where should we deliver your order?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name *</Label>
                  <Input
                    id="name"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    placeholder="10-digit number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address1" className="text-white">Address Line 1 *</Label>
                <Input
                  id="address1"
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="bg-gray-900/50 border-gray-700 text-white"
                  placeholder="House/Flat number, Building name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address2" className="text-white">Address Line 2</Label>
                <Input
                  id="address2"
                  value={address.addressLine2}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  className="bg-gray-900/50 border-gray-700 text-white"
                  placeholder="Street, Landmark (Optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white">City *</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    placeholder="City name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-white">PIN Code *</Label>
                  <Input
                    id="pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    placeholder="6-digit PIN"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleAddressSubmit}
              disabled={!address.name || !address.phone || !address.addressLine1 || !address.city || !address.pincode}
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
                <h2 className="text-xl font-bold text-white">Payment Method</h2>
                <p className="text-gray-400 text-sm">Choose your preferred payment option</p>
              </div>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
              <div className="space-y-3">
                <div className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-900/30'
                  }`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="upi" id="upi" className="text-blue-500" />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="upi" className="font-semibold text-white cursor-pointer">
                          UPI Payment
                        </Label>
                        <p className="text-sm text-gray-400">Pay using UPI ID</p>
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
                      <Label htmlFor="upiId" className="text-white">UPI ID</Label>
                      <Input
                        id="upiId"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="yourname@paytm"
                      />
                    </motion.div>
                  )}
                </div>

                <div className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-900/30'
                  }`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="cod" id="cod" className="text-green-500" />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Truck className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="cod" className="font-semibold text-white cursor-pointer">
                          Cash on Delivery
                        </Label>
                        <p className="text-sm text-gray-400">Pay when you receive</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('address')}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
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
                <h2 className="text-xl font-bold text-white">Review Order</h2>
                <p className="text-gray-400 text-sm">Confirm your order details</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white">Order Items</h3>
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</p>
                  </div>
                  <p className="text-white font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Delivery Address</h3>
              <div className="p-3 bg-gray-900/30 rounded-lg">
                <p className="text-white font-medium">{address.name}</p>
                <p className="text-gray-400 text-sm">{address.phone}</p>
                <p className="text-gray-400 text-sm">
                  {address.addressLine1}, {address.addressLine2}<br />
                  {address.city} - {address.pincode}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Payment Method</h3>
              <div className="p-3 bg-gray-900/30 rounded-lg">
                <p className="text-white font-medium">
                  {paymentMethod === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
                </p>
                {paymentMethod === 'upi' && (
                  <p className="text-gray-400 text-sm">{upiId}</p>
                )}
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-2 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'text-green-400' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('payment')}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
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
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30">
              <Clock className="w-10 h-10 text-blue-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Processing Order...</h2>
            <p className="text-gray-400 text-center">Please wait while we confirm your order</p>
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mt-6" />
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-400 text-center mb-6">
              Your order will be delivered in 2-3 business days
            </p>
            <div className="w-full max-w-sm p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <p className="text-green-400 font-semibold text-center">Order ID: #JF{Date.now().toString().slice(-6)}</p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-lg border-b border-gray-700 p-4 z-10">
        <div className="flex items-center gap-4">
          {step !== 'processing' && step !== 'success' && (
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold text-white flex-1">
            {step === 'success' ? 'Order Confirmed' : 'Checkout'}
          </h1>
        </div>
      </div>

      {/* Progress Indicator */}
      {step !== 'processing' && step !== 'success' && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {['address', 'payment', 'review'].map((s, index) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === s ? 'bg-red-500 text-white' :
                  ['address', 'payment', 'review'].indexOf(step) > index ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                  {['address', 'payment', 'review'].indexOf(step) > index ? '✓' : index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-2 ${['address', 'payment', 'review'].indexOf(step) > index ? 'bg-green-500' : 'bg-gray-700'
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