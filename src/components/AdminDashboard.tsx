import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Plus, Package, TrendingUp, Users, DollarSign, Edit, Trash2, Upload, X,
  ImageIcon, Camera, Save, Eye, RotateCcw, Star, CheckCircle, AlertCircle,
  Palette, Ruler, Package2, Tag, Layers, Zap, ShoppingBag, Heart
} from 'lucide-react';
import { type Product, type Screen } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct?: (productId: string, product: Omit<Product, 'id'>) => void;
  onDeleteProduct?: (productId: string) => void;
  onNavigate: (screen: Screen) => void;
}

interface NewProduct {
  name: string;
  description: string;
  price: string;
  image: string;
  stock: string;
  tags: string;
  category: string;
  brand: string;
  color: string;
  material: string;
  sizes: string[];
}

const PREDEFINED_CATEGORIES = ['Sneakers', 'Formal', 'Sports', 'Boots', 'Casual', 'Sandals'];
const PREDEFINED_BRANDS = ['Janata', 'Premium Collection', 'Sport Line', 'Formal Series'];
const PREDEFINED_COLORS = ['Black', 'White', 'Brown', 'Blue', 'Red', 'Gray', 'Tan', 'Green'];
const PREDEFINED_MATERIALS = ['Leather', 'Synthetic', 'Canvas', 'Mesh', 'Suede', 'Patent Leather', 'Synthetic Leather'];
const AVAILABLE_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12'];

export function AdminDashboard({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'add-product'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: '',
    tags: '',
    category: '',
    brand: 'Janata',
    color: '',
    material: '',
    sizes: []
  });

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockProducts = products.filter(product => product.stock < 5);

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      image: '',
      stock: '',
      tags: '',
      category: '',
      brand: 'Janata',
      color: '',
      material: '',
      sizes: []
    });
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category) {
      toast.error('Please fill all required fields');
      return;
    }

    const product: Omit<Product, 'id'> = {
      name: newProduct.name,
      description: newProduct.description,
      price: parseInt(newProduct.price),
      image: newProduct.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      stock: parseInt(newProduct.stock),
      tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      category: newProduct.category,
      brand: newProduct.brand,
      color: newProduct.color,
      material: newProduct.material,
      sizes: newProduct.sizes
    };

    if (editingProduct && onUpdateProduct) {
      onUpdateProduct(editingProduct.id, product);
    } else {
      onAddProduct(product);
    }

    resetForm();
    setActiveTab('products');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image: product.image,
      stock: product.stock.toString(),
      tags: product.tags.join(', '),
      category: product.category,
      brand: product.brand || 'Janata',
      color: product.color || '',
      material: product.material || '',
      sizes: product.sizes || []
    });
    setActiveTab('add-product');
  };

  const handleDeleteProduct = (productId: string) => {
    if (onDeleteProduct && window.confirm('Are you sure you want to delete this product?')) {
      onDeleteProduct(productId);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server
      // For now, we'll use a placeholder URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProduct({ ...newProduct, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (size: string) => {
    setNewProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size].sort()
    }));
  };

  const statsCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Stock',
      value: totalStock,
      icon: Package2,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Inventory Value',
      value: `₹${(totalValue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts.length,
      icon: AlertCircle,
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const renderOverview = () => (
    <motion.div
      className="space-y-6 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Manage your footwear inventory with ease</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className={`p-4 ${stat.bgColor} rounded-xl`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</span>
                </div>
                <p className="text-sm text-slate-600">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => setActiveTab('add-product')}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl justify-start"
          >
            <Plus className="w-5 h-5 mr-3" />
            Add New Product
          </Button>
          <Button
            onClick={() => setActiveTab('products')}
            variant="outline"
            className="w-full py-4 rounded-xl justify-start"
          >
            <Package className="w-5 h-5 mr-3" />
            Manage Products
          </Button>
          <Button
            onClick={() => onNavigate('catalog')}
            variant="outline"
            className="w-full py-4 rounded-xl justify-start"
          >
            <Eye className="w-5 h-5 mr-3" />
            View Store
          </Button>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-3">
                {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} running low on stock
              </p>
              <div className="space-y-2">
                {lowStockProducts.slice(0, 3).map(product => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="text-sm text-red-800">{product.name}</span>
                    <Badge variant="destructive">
                      {product.stock} left
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );

  const renderProducts = () => (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Product Management</h2>
          <p className="text-slate-600 text-sm">Manage your inventory and product details</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setActiveTab('add-product');
          }}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 line-clamp-1">{product.name}</h3>
                        <p className="text-red-600 font-bold text-lg">₹{product.price.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {product.description && (
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">{product.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge
                        variant={product.stock < 5 ? "destructive" : "secondary"}
                        className={product.stock < 5 ? "bg-red-500 text-white" : "bg-slate-100 text-slate-700"}
                      >
                        Stock: {product.stock}
                      </Badge>
                      <Badge variant="outline" className="border-slate-300">
                        {product.category}
                      </Badge>
                      {product.brand && (
                        <Badge variant="outline" className="border-blue-300 text-blue-700">
                          {product.brand}
                        </Badge>
                      )}
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map(size => (
                          <span
                            key={size}
                            className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No products yet</h3>
            <p className="text-slate-500 mb-4">Start by adding your first product to the inventory</p>
            <Button
              onClick={() => {
                resetForm();
                setActiveTab('add-product');
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderAddProduct = () => (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 ${editingProduct ? 'bg-blue-500' : 'bg-green-500'} rounded-full flex items-center justify-center`}>
          {editingProduct ? <Edit className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-slate-600 text-sm">
            {editingProduct ? 'Update product information' : 'Fill in the product details below'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5 text-blue-500" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-sm font-medium">Product Name *</Label>
              <Input
                id="productName"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="border-slate-300 focus:border-red-500 focus:ring-red-500"
                placeholder="e.g., Classic Sports Sneakers"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border-slate-300 focus:border-red-500 focus:ring-red-500 min-h-20"
                placeholder="Describe the product features, comfort, style, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="border-slate-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="2999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="border-slate-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tag className="w-5 h-5 text-purple-500" />
              Product Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category *</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value: any) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger className="border-slate-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Brand</Label>
                <Select
                  value={newProduct.brand}
                  onValueChange={(value: any) => setNewProduct({ ...newProduct, brand: value })}
                >
                  <SelectTrigger className="border-slate-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_BRANDS.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Color</Label>
                <Select
                  value={newProduct.color}
                  onValueChange={(value: any) => setNewProduct({ ...newProduct, color: value })}
                >
                  <SelectTrigger className="border-slate-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_COLORS.map(color => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-slate-300"
                            style={{ backgroundColor: color.toLowerCase() === 'tan' ? '#d2b48c' : color.toLowerCase() }}
                          />
                          {color}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Material</Label>
                <Select
                  value={newProduct.material}
                  onValueChange={(value: any) => setNewProduct({ ...newProduct, material: value })}
                >
                  <SelectTrigger className="border-slate-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_MATERIALS.map(material => (
                      <SelectItem key={material} value={material}>{material}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tags</Label>
              <Input
                value={newProduct.tags}
                onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
                className="border-slate-300 focus:border-red-500 focus:ring-red-500"
                placeholder="comfortable, lightweight, waterproof (comma-separated)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sizes */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ruler className="w-5 h-5 text-orange-500" />
              Available Sizes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_SIZES.map(size => (
                <motion.button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`p-3 rounded-lg border-2 transition-all ${newProduct.sizes.includes(size)
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-red-300'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-medium">{size}</span>
                </motion.button>
              ))}
            </div>
            {newProduct.sizes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-sm text-slate-600">Selected: </span>
                {newProduct.sizes.map(size => (
                  <Badge key={size} variant="secondary" className="bg-red-100 text-red-700">
                    {size}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="w-5 h-5 text-green-500" />
              Product Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Image URL</Label>
              <Input
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                className="border-slate-300 focus:border-red-500 focus:ring-red-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">or</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-slate-300 hover:border-red-500"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </div>

            {/* Image Preview */}
            {(newProduct.image || newProduct.name) && (
              <motion.div
                className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </h4>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-200 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={newProduct.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'}
                      alt={newProduct.name || 'Product preview'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-slate-900">{newProduct.name || 'Product Name'}</h5>
                    {newProduct.description && (
                      <p className="text-sm text-slate-600 mb-1 line-clamp-2">{newProduct.description}</p>
                    )}
                    {newProduct.price && (
                      <p className="text-red-600 font-bold">₹{parseInt(newProduct.price || '0').toLocaleString()}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newProduct.category && (
                        <Badge variant="outline" className="text-xs">{newProduct.category}</Badge>
                      )}
                      {newProduct.brand && (
                        <Badge variant="outline" className="text-xs">{newProduct.brand}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              setActiveTab('overview');
            }}
            className="flex-1 border-slate-300 hover:border-slate-400"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleAddProduct}
            disabled={!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Tab Navigation */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-slate-200 p-4 z-10 admin-nav-container">
        <div className="flex gap-2 max-w-md mx-auto overflow-x-hidden">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'add-product', label: editingProduct ? 'Edit Product' : 'Add Product', icon: editingProduct ? Edit : Plus }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 ${activeTab === tab.id
                ? "bg-red-500 text-white shadow-lg hover:bg-red-600"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">
                {tab.id === 'overview' ? 'Home' :
                  tab.id === 'products' ? 'Items' :
                    editingProduct ? 'Edit' : 'Add'}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'add-product' && renderAddProduct()}
        </AnimatePresence>
      </div>
    </div>
  );
}