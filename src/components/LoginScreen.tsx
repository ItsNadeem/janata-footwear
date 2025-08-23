import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Smartphone, Shield, User, ArrowRight } from 'lucide-react';
import { type UserRole } from '../App';
import shoeaLogo from 'figma:asset/22a145728baa3db5f87cbff33464e96e1f1f2ffa.png';

interface LoginScreenProps {
  onLogin: (phone: string, role: UserRole) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [role, setRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length !== 10) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setShowOTP(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (otp !== '123456') return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin(phone, role);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 p-3 shadow-lg mx-auto mb-4">
            <img
              src={shoeaLogo}
              alt="Janata Footwear Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Janata Footwear</h1>
          <p className="text-slate-600">Step into comfort and style</p>
        </motion.div>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600">
              {showOTP ? 'Enter the OTP sent to your phone' : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!showOTP ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-slate-700">Login as</Label>
                  <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${role === 'customer'
                          ? 'border-red-500 bg-red-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        onClick={() => setRole('customer')}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="customer" id="customer" className="text-red-500" />
                          <div className="flex items-center gap-2 flex-1">
                            <User className="w-5 h-5 text-slate-600" />
                            <Label htmlFor="customer" className="font-medium text-slate-700 cursor-pointer">
                              Customer
                            </Label>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${role === 'admin'
                          ? 'border-red-500 bg-red-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        onClick={() => setRole('admin')}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="admin" id="admin" className="text-red-500" />
                          <div className="flex items-center gap-2 flex-1">
                            <Shield className="w-5 h-5 text-slate-600" />
                            <Label htmlFor="admin" className="font-medium text-slate-700 cursor-pointer">
                              Admin
                            </Label>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Phone Input */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700">Phone Number</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">+91</span>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="pl-12 bg-white border-slate-300 text-slate-900 focus:border-red-500 focus:ring-red-500/20"
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                  {phone.length > 0 && phone.length !== 10 && (
                    <p className="text-sm text-red-600">Please enter a valid 10-digit phone number</p>
                  )}
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={phone.length !== 10 || isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl btn-wrap btn-responsive"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending OTP...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Send OTP
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* OTP Input */}
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-slate-700">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-widest bg-white border-slate-300 text-slate-900 focus:border-red-500 focus:ring-red-500/20"
                    placeholder="123456"
                    maxLength={6}
                  />
                  <p className="text-sm text-slate-500 text-center">
                    Sent to +91 {phone.slice(0, 2)}****{phone.slice(-2)}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-600">Demo OTP: <span className="font-mono font-semibold text-red-600">123456</span></p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowOTP(false)}
                    className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={otp.length !== 6 || isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold btn-wrap btn-responsive"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      'Verify & Login'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="text-center">
              <p className="text-xs text-slate-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-slate-500">
            Quality footwear for every occasion
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}