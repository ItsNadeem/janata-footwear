import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  ShoppingBag,
  LogOut,
  Store,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { type Order } from '../App';

interface ProfileProps {
  user: { phone: string; name?: string };
  orders: Order[];
  onUpdateProfile: (updates: Partial<{ name: string; phone: string; email: string }>) => void;
  onLogout: () => void;
  onBack: () => void;
}

interface UserProfile {
  name: string;
  phone: string;
  email: string;
}

export function Profile({ user, orders, onUpdateProfile, onLogout, onBack }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('orders');
  const [profile, setProfile] = useState<UserProfile>({
    name: user.name || '',
    phone: user.phone,
    email: ''
  });

  const handleSaveProfile = () => {
    onUpdateProfile({
      name: profile.name || undefined,
      phone: profile.phone,
      email: profile.email || undefined
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'confirmed':
        return <AlertCircle className="w-3 h-3" />;
      case 'ready':
        return <Package className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'cancelled':
        return <X className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const activeOrders = orders.filter(order =>
    order.status === 'pending' || order.status === 'confirmed' || order.status === 'ready'
  );
  const completedOrders = orders.filter(order =>
    order.status === 'completed' || order.status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-slate-200 p-4 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-900 flex-1">Profile</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors relative ${activeTab === 'orders'
              ? 'text-red-600 bg-red-50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>My Orders</span>
              {activeOrders.length > 0 && (
                <Badge className="bg-red-500 text-white ml-1 text-xs">
                  {activeOrders.length}
                </Badge>
              )}
            </div>
            {activeTab === 'orders' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors relative ${activeTab === 'profile'
              ? 'text-red-600 bg-red-50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              <span>Account</span>
            </div>
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700">{orders.length}</div>
                    <div className="text-xs text-blue-600">Total Orders</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-700">{activeOrders.length}</div>
                    <div className="text-xs text-yellow-600">Active</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">{completedOrders.length}</div>
                    <div className="text-xs text-green-600">Completed</div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Orders */}
              {activeOrders.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    Active Orders
                  </h3>
                  {activeOrders.map((order) => (
                    <Card key={order.id} className="bg-white border border-slate-200 shadow-sm">
                      <CardContent className="p-4">
                        {/* Order Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">#{order.id}</p>
                              <p className="text-sm text-slate-600">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} px-2 py-1 rounded-full border text-xs`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status.toUpperCase()}
                            </div>
                          </Badge>
                        </div>

                        {/* Order Items Summary */}
                        <div className="space-y-2 mb-3">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-slate-700">
                                {item.name} {item.size && `(${item.size})`} × {item.quantity}
                              </span>
                              <span className="text-slate-900 font-medium">
                                ₹{((item.discount ? item.price * (1 - item.discount / 100) : item.price) * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-slate-500">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>

                        <Separator className="my-3" />

                        {/* Order Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin className="w-4 h-4" />
                              <span>Store Pickup</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              {order.paymentMethod === 'upi' ? (
                                <Smartphone className="w-4 h-4" />
                              ) : (
                                <CreditCard className="w-4 h-4" />
                              )}
                              <span>{order.paymentMethod === 'upi' ? 'UPI Payment' : 'Pay at Store'}</span>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="text-slate-900 font-semibold">
                              Total: ₹{order.total.toLocaleString()}
                            </div>
                            {order.status === 'ready' && (
                              <div className="text-green-600 text-xs font-medium">
                                Ready for pickup!
                              </div>
                            )}
                            {order.estimatedPickupTime && order.status !== 'ready' && (
                              <div className="text-slate-600 text-xs">
                                Est. ready: {formatDate(order.estimatedPickupTime)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <div className="flex items-center justify-between text-xs">
                            <div className={`flex items-center gap-1 ${['pending', 'confirmed', 'ready', 'completed'].includes(order.status)
                              ? 'text-green-600' : 'text-slate-400'
                              }`}>
                              <div className="w-2 h-2 rounded-full bg-current" />
                              <span>Ordered</span>
                            </div>
                            <div className={`flex items-center gap-1 ${['confirmed', 'ready', 'completed'].includes(order.status)
                              ? 'text-green-600' : 'text-slate-400'
                              }`}>
                              <div className="w-2 h-2 rounded-full bg-current" />
                              <span>Confirmed</span>
                            </div>
                            <div className={`flex items-center gap-1 ${['ready', 'completed'].includes(order.status)
                              ? 'text-green-600' : 'text-slate-400'
                              }`}>
                              <div className="w-2 h-2 rounded-full bg-current" />
                              <span>Ready</span>
                            </div>
                            <div className={`flex items-center gap-1 ${order.status === 'completed' ? 'text-green-600' : 'text-slate-400'
                              }`}>
                              <div className="w-2 h-2 rounded-full bg-current" />
                              <span>Picked Up</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Order History */}
              {completedOrders.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Order History
                  </h3>
                  {completedOrders.map((order) => (
                    <Card key={order.id} className="bg-white border border-slate-200 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                              {order.status === 'completed' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">#{order.id}</p>
                              <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">₹{order.total.toLocaleString()}</p>
                            <Badge className={`${getStatusColor(order.status)} px-2 py-0.5 rounded-full border text-xs`}>
                              {order.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">
                          {order.items.length} items • {order.paymentMethod === 'upi' ? 'UPI Payment' : 'Cash Payment'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {orders.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">No Orders Yet</h3>
                  <p className="text-slate-600 mb-6">Start shopping to see your orders here</p>
                  <Button
                    onClick={onBack}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-xl"
                  >
                    Start Shopping
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Profile Card */}
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">Account Information</h2>
                        <p className="text-sm text-slate-600">Manage your personal details</p>
                      </div>
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (isEditing) {
                          setProfile({
                            name: user.name || '',
                            phone: user.phone,
                            email: ''
                          });
                        }
                        setIsEditing(!isEditing);
                      }}
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-slate-900 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Full Name
                        </Label>
                        <Input
                          id="edit-name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="bg-white border-slate-300 text-slate-900"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-phone" className="text-slate-900 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="edit-phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="bg-white border-slate-300 text-slate-900"
                          placeholder="10-digit mobile number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-email" className="text-slate-900 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="bg-white border-slate-300 text-slate-900"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={handleSaveProfile}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center justify-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setProfile({
                              name: user.name || '',
                              phone: user.phone,
                              email: ''
                            });
                            setIsEditing(false);
                          }}
                          className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <User className="w-5 h-5 text-slate-600" />
                        <div className="flex-1">
                          <p className="text-sm text-slate-600">Full Name</p>
                          <p className="font-medium text-slate-900">{user.name || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Phone className="w-5 h-5 text-slate-600" />
                        <div className="flex-1">
                          <p className="text-sm text-slate-600">Phone Number</p>
                          <p className="font-medium text-slate-900">{user.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Mail className="w-5 h-5 text-slate-600" />
                        <div className="flex-1">
                          <p className="text-sm text-slate-600">Email Address</p>
                          <p className="font-medium text-slate-900">Not provided</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Store Information */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Store className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">Store Information</h3>
                  </div>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p><strong>Address:</strong> Janata Footwear, Main Market Street</p>
                    <p><strong>Hours:</strong> 10:00 AM - 8:00 PM (Daily)</p>
                    <p><strong>Contact:</strong> +91 98765 43210</p>
                  </div>
                </CardContent>
              </Card>

              {/* Logout Section */}
              <Card className="bg-white border border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Sign Out</h3>
                        <p className="text-sm text-slate-600">Sign out of your account</p>
                      </div>
                    </div>
                    <Button
                      onClick={onLogout}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                    >
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}