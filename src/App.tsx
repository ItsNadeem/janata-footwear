import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductCatalog } from './components/ProductCatalog';
import { Cart } from './components/Cart';
import { Wishlist } from './components/Wishlist';
import { Checkout } from './components/Checkout';
import { BottomNavigation } from './components/BottomNavigation';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { LogOut, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import shoeaLogo from 'figma:asset/22a145728baa3db5f87cbff33464e96e1f1f2ffa.png';

export type UserRole = 'customer' | 'admin';
export type Screen = 'splash' | 'login' | 'dashboard' | 'catalog' | 'cart' | 'wishlist' | 'checkout' | 'admin';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  images?: string[]; // Multiple images support
  stock: number;
  sizes?: string[]; // Available sizes
  tags: string[];
  category: string;
  brand?: string;
  color?: string;
  material?: string;
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  discount?: number; // Discount percentage applied
}

export interface ProductDiscount {
  productId: string;
  discount: number;
  attemptsUsed: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ phone: string; name?: string } | null>(null);

  // App state with more sample products for infinite scroll
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Classic Sports Sneakers',
      description: 'Comfortable and stylish sports sneakers perfect for everyday wear and light workouts.',
      price: 2499,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1579446565308-427218a2c60e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNwb3J0cyUyMHNuZWFrZXJzJTIwcnVubmluZyUyMHNob2VzfGVufDF8fHx8MTc1NTk1MjQzMXww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
      ],
      stock: 15,
      sizes: ['7', '8', '9', '10', '11'],
      tags: ['sports', 'casual', 'comfortable'],
      category: 'Sneakers',
      brand: 'Janata',
      color: 'White',
      material: 'Synthetic'
    },
    {
      id: '2',
      name: 'Formal Leather Shoes',
      description: 'Premium leather formal shoes suitable for office and business occasions.',
      price: 3999,
      image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1576133384936-ea17c54e9fd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGxlYXRoZXIlMjBmb3JtYWwlMjBkcmVzcyUyMHNob2VzfGVufDF8fHx8MTc1NTk1MjQzNXww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop&sat=-100',
        'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop&brightness=110'
      ],
      stock: 8,
      sizes: ['7', '8', '9', '10'],
      tags: ['formal', 'leather', 'office'],
      category: 'Formal',
      brand: 'Janata',
      color: 'Black',
      material: 'Genuine Leather'
    },
    {
      id: '3',
      name: 'Running Shoes',
      description: 'Lightweight running shoes with excellent cushioning and breathability.',
      price: 3499,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1724921196005-080aeb8de120?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwcnVubmluZyUyMGF0aGxldGljJTIwc2hvZXN8ZW58MXx8fHwxNzU1OTUyNDM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1522669547617-84967777d313?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHJ1bm5pbmclMjBzaG9lcyUyMG1lc2h8ZW58MXx8fHwxNzU1OTUyNDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop'
      ],
      stock: 12,
      sizes: ['6', '7', '8', '9', '10', '11', '12'],
      tags: ['running', 'sports', 'lightweight'],
      category: 'Sports',
      brand: 'Janata',
      color: 'Blue',
      material: 'Mesh'
    },
    {
      id: '4',
      name: 'Casual Loafers',
      description: 'Comfortable slip-on loafers for casual and semi-formal occasions.',
      price: 2799,
      image: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1708962000105-849e984e69a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGxlYXRoZXIlMjBsb2FmZXJzJTIwY2FzdWFsfGVufDF8fHx8MTc1NTk1MjQ0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=400&fit=crop&contrast=120',
        'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=400&fit=crop&sat=80'
      ],
      stock: 20,
      sizes: ['7', '8', '9', '10', '11'],
      tags: ['casual', 'comfort', 'slip-on'],
      category: 'Casual',
      brand: 'Janata',
      color: 'Brown',
      material: 'Suede'
    },
    {
      id: '5',
      name: 'High-Top Basketball Shoes',
      description: 'High-performance basketball shoes with ankle support and superior grip.',
      price: 4299,
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1636031855107-ea6f414524f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwaGlnaCUyMHRvcCUyMHNob2VzJTIwcmVkfGVufDF8fHx8MTc1NTk1MjQ0NXww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&hue=30'
      ],
      stock: 6,
      sizes: ['8', '9', '10', '11', '12'],
      tags: ['basketball', 'sports', 'high-top'],
      category: 'Sports',
      brand: 'Janata',
      color: 'Red',
      material: 'Synthetic Leather'
    },
    {
      id: '6',
      name: 'Elegant Heels',
      description: 'Stylish heels perfect for formal events and special occasions.',
      price: 3299,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1714038918283-e47108b58868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhpZ2glMjBoZWVscyUyMGVsZWdhbnQlMjBmb3JtYWx8ZW58MXx8fHwxNzU1OTUyNDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop&contrast=110',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop&brightness=95',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop&sat=120'
      ],
      stock: 14,
      sizes: ['5', '6', '7', '8', '9'],
      tags: ['formal', 'heels', 'elegant'],
      category: 'Formal',
      brand: 'Janata',
      color: 'Black',
      material: 'Patent Leather'
    },
    {
      id: '7',
      name: 'Hiking Boots',
      description: 'Durable hiking boots designed for outdoor adventures and rough terrain.',
      price: 5499,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1603920346280-75b4832fb6a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhpa2luZyUyMGJvb3RzJTIwb3V0ZG9vcnxlbnwxfHx8fDE3NTU5NTI0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1608256246200-53e8b47b2db8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&contrast=105',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&sat=90'
      ],
      stock: 9,
      sizes: ['7', '8', '9', '10', '11', '12'],
      tags: ['outdoor', 'hiking', 'durable'],
      category: 'Boots',
      brand: 'Janata',
      color: 'Brown',
      material: 'Waterproof Leather'
    },
    {
      id: '8',
      name: 'Canvas Sneakers',
      description: 'Classic canvas sneakers with a timeless design and comfortable fit.',
      price: 1899,
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1663151860122-4890a08dc22b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhbnZhcyUyMHNuZWFrZXJzJTIwY2FzdWFsfGVufDF8fHx8MTc1NTk1MjQ1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop&brightness=110',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop&contrast=95'
      ],
      stock: 25,
      sizes: ['6', '7', '8', '9', '10', '11'],
      tags: ['casual', 'canvas', 'lightweight'],
      category: 'Sneakers',
      brand: 'Janata',
      color: 'White',
      material: 'Canvas'
    },
    {
      id: '9',
      name: 'Oxford Dress Shoes',
      description: 'Premium Oxford dress shoes crafted from finest leather for formal occasions.',
      price: 4599,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1614732145188-bb8b5e12968c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxveGZvcmQlMjBkcmVzcyUyMHNob2VzJTIwYmxhY2slMjBsZWF0aGVyfGVufDF8fHx8MTc1NTk1MjQ2MHww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop&sat=120',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop&contrast=110'
      ],
      stock: 7,
      sizes: ['7', '8', '9', '10', '11'],
      tags: ['formal', 'oxford', 'premium'],
      category: 'Formal',
      brand: 'Janata',
      color: 'Black',
      material: 'Full Grain Leather'
    },
    {
      id: '10',
      name: 'Slip-On Sneakers',
      description: 'Easy-to-wear slip-on sneakers perfect for quick outings and casual wear.',
      price: 2199,
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1646869623523-2120987bbd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmF5JTIwc2xpcCUyMG9uJTIwc25lYWtlcnN8ZW58MXx8fHwxNzU1OTUyNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&contrast=105',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&sat=80'
      ],
      stock: 18,
      sizes: ['7', '8', '9', '10', '11'],
      tags: ['casual', 'slip-on', 'easy-wear'],
      category: 'Sneakers',
      brand: 'Janata',
      color: 'Gray',
      material: 'Knit'
    },
    {
      id: '11',
      name: 'Athletic Running Shoes',
      description: 'Performance-focused athletic shoes designed for serious runners and fitness enthusiasts.',
      price: 3799,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1522669547617-84967777d313?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHJ1bm5pbmclMjBzaG9lcyUyMG1lc2h8ZW58MXx8fHwxNzU1OTUyNDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&contrast=110',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&sat=120'
      ],
      stock: 11,
      sizes: ['6', '7', '8', '9', '10', '11', '12'],
      tags: ['running', 'athletic', 'performance'],
      category: 'Sports',
      brand: 'Janata',
      color: 'Blue',
      material: 'Breathable Mesh'
    },
    {
      id: '12',
      name: 'Chelsea Boots',
      description: 'Versatile Chelsea boots that pair well with both casual and smart-casual outfits.',
      price: 4199,
      image: 'https://images.unsplash.com/photo-1608256246200-53e8b47b2db8?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1608256246200-53e8b47b2db8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1686838560320-18b64b945ed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW4lMjBjaGVsc2VhJTIwYm9vdHMlMjBzdWVkZXxlbnwxfHx8fDE3NTU5NTI0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1608256246200-53e8b47b2db8?w=400&h=400&fit=crop&brightness=105',
        'https://images.unsplash.com/photo-1608256246200-53e8b47b2db8?w=400&h=400&fit=crop&contrast=95'
      ],
      stock: 13,
      sizes: ['7', '8', '9', '10', '11'],
      tags: ['boots', 'chelsea', 'versatile'],
      category: 'Boots',
      brand: 'Janata',
      color: 'Tan',
      material: 'Suede'
    },
    {
      id: '13',
      name: 'Minimalist Sneakers',
      description: 'Clean and modern minimalist sneakers with a sleek design for everyday wear.',
      price: 2899,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1718802312915-4e03a6f33735?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd2hpdGUlMjBsZWF0aGVyJTIwc25lYWtlcnN8ZW58MXx8fHwxNzU1OTUyNDczfDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&sat=90',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&brightness=110'
      ],
      stock: 22,
      sizes: ['6', '7', '8', '9', '10', '11'],
      tags: ['minimalist', 'clean', 'modern'],
      category: 'Sneakers',
      brand: 'Janata',
      color: 'White',
      material: 'Leather'
    },
    {
      id: '14',
      name: 'Work Boots',
      description: 'Heavy-duty work boots with safety features for industrial and construction use.',
      price: 5299,
      image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1648786196507-f89c8fbc1d0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JrJTIwYm9vdHMlMjBzdGVlbCUyMHRvZSUyMGJyb3dufGVufDF8fHx8MTc1NTk1MjQ3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop&contrast=115',
        'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop&sat=110'
      ],
      stock: 8,
      sizes: ['7', '8', '9', '10', '11', '12'],
      tags: ['work', 'durable', 'safety'],
      category: 'Boots',
      brand: 'Janata',
      color: 'Brown',
      material: 'Steel Toe Leather'
    },
    {
      id: '15',
      name: 'Summer Sandals',
      description: 'Breathable summer sandals perfect for hot weather and beach activities.',
      price: 1599,
      image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1663693586817-f7e0ceb27bd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBzYW5kYWxzJTIwdGFuJTIwbGVhdGhlcnxlbnwxfHx8fDE3NTU5NTI0ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop&sat=120',
        'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop&brightness=105',
        'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop&contrast=95'
      ],
      stock: 30,
      sizes: ['6', '7', '8', '9', '10', '11'],
      tags: ['summer', 'sandals', 'breathable'],
      category: 'Casual',
      brand: 'Janata',
      color: 'Tan',
      material: 'Synthetic'
    }
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [productDiscounts, setProductDiscounts] = useState<Record<string, ProductDiscount>>({});

  const handleSplashComplete = () => {
    setCurrentScreen('login');
  };

  const handleLogin = (phone: string, role: UserRole) => {
    setUser({ phone });
    setUserRole(role);
    setIsAuthenticated(true);
    setCurrentScreen('dashboard');
    toast.success(`Welcome to Janata Footwear!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentScreen('login');
    setCart([]);
    setWishlist([]);
    setProductDiscounts({});
    toast.success('Logged out successfully');
  };

  const addToCart = (product: Product, size?: string, discount?: number) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.size === size);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, size, discount }];
    });
    toast.success('Added to cart!');
  };

  const applyDiscount = (productId: string, discount: number) => {
    setProductDiscounts(prev => ({
      ...prev,
      [productId]: {
        productId,
        discount,
        attemptsUsed: prev[productId]?.attemptsUsed || 0
      }
    }));
    toast.success(`${discount}% discount applied!`);
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.size === size)));
    toast.success('Removed from cart');
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity === 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
    toast.success(wishlist.find(item => item.id === product.id) ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
    toast.success('Product added successfully!');
  };

  const updateProduct = (productId: string, updatedProduct: Omit<Product, 'id'>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...updatedProduct, id: productId }
          : product
      )
    );
    toast.success('Product updated successfully!');
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
    toast.success('Product deleted successfully!');
  };

  // Show splash screen
  if (currentScreen === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return userRole === 'admin' ? (
          <AdminDashboard
            products={products}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onNavigate={setCurrentScreen}
          />
        ) : (
          <CustomerDashboard
            onNavigate={setCurrentScreen}
            cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)}
            wishlistCount={wishlist.length}
          />
        );
      case 'catalog':
        return (
          <ProductCatalog
            products={products}
            onAddToCart={addToCart}
            onAddToWishlist={addToWishlist}
            wishlist={wishlist}
            productDiscounts={productDiscounts}
            onApplyDiscount={applyDiscount}
            onBack={() => setCurrentScreen('dashboard')}
          />
        );
      case 'cart':
        return (
          <Cart
            items={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={() => setCurrentScreen('checkout')}
            onBack={() => setCurrentScreen('dashboard')}
          />
        );
      case 'wishlist':
        return (
          <Wishlist
            items={wishlist}
            onAddToCart={addToCart}
            onRemoveFromWishlist={addToWishlist}
            onBack={() => setCurrentScreen('dashboard')}
          />
        );
      case 'checkout':
        return (
          <Checkout
            items={cart}
            onOrderComplete={() => {
              setCart([]);
              setCurrentScreen('dashboard');
              toast.success('Order placed successfully!');
            }}
            onBack={() => setCurrentScreen('cart')}
          />
        );
      default:
        return <div>Screen not found</div>;
    }
  };

  // Determine if we should show bottom navigation (only for customer users)
  const showBottomNav = userRole === 'customer' && currentScreen !== 'checkout';

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <motion.header
        className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm">
            <img
              src={shoeaLogo}
              alt="Janata Footwear Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-xl text-slate-900">Janata Footwear</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-full border border-red-200">
            {userRole === 'admin' ? <Shield className="w-4 h-4 text-red-600" /> : <User className="w-4 h-4 text-red-600" />}
            <span className="text-xs text-red-600 capitalize font-medium">{userRole}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-slate-600 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className={`flex-1 bg-slate-50 ${showBottomNav ? 'pb-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation - Only for Customer Users */}
      {showBottomNav && (
        <BottomNavigation
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)}
          wishlistCount={wishlist.length}
        />
      )}

      <Toaster />
    </div>
  );
}