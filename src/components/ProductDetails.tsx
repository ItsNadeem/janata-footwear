import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { type Product, type ProductDiscount } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailsProps {
  product: Product;
  isInWishlist: boolean;
  productDiscount?: ProductDiscount;
  onAddToCart: (product: Product, size?: string, discount?: number) => void;
  onAddToWishlist: (product: Product) => void;
  onBack: () => void;
}

export function ProductDetails({
  product,
  isInWishlist,
  productDiscount,
  onAddToCart,
  onAddToWishlist,
  onBack
}: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all product images (fallback to main image if images array is not available)
  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const discountedPrice = productDiscount
    ? product.price * (1 - productDiscount.discount / 100)
    : product.price;

  const handleAddToCart = () => {
    // Check if size selection is required but missing
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      // Don't add to cart, just return early
      return;
    }

    const discount = productDiscount?.discount;
    onAddToCart(product, selectedSize, discount);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-lg border-b border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-slate-900 line-clamp-1 flex-1">
            Product Details
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddToWishlist(product)}
            className={`${isInWishlist
              ? 'text-pink-500 hover:text-pink-600 hover:bg-pink-50'
              : 'text-slate-600 hover:text-pink-500 hover:bg-pink-50'
              }`}
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Product Images Carousel */}
        <div className="aspect-square bg-slate-100 relative flex-shrink-0 overflow-hidden">
          {/* Main Image Display */}
          <div className="w-full h-full">
            <ImageWithFallback
              src={productImages[currentImageIndex]}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-200"
            />
          </div>

          {/* Navigation Arrows */}
          {productImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full w-10 h-10 p-0"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full w-10 h-10 p-0"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </Button>
            </>
          )}

          {/* Image Dots Indicator */}
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentImageIndex
                    ? 'bg-white shadow-lg'
                    : 'bg-white/50 hover:bg-white/75'
                    }`}
                />
              ))}
            </div>
          )}

          {/* Image Counter (for desktop) */}
          {productImages.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 hidden sm:block">
              <span className="text-white text-sm font-medium">
                {currentImageIndex + 1} / {productImages.length}
              </span>
            </div>
          )}

          {/* Stock Badge */}
          {product.stock < 5 && (
            <Badge className="absolute top-4 left-4 bg-red-500 text-white z-10">
              Only {product.stock} left
            </Badge>
          )}

          {/* Discount Badge */}
          {productDiscount && (
            <Badge className="absolute top-4 right-4 bg-green-500 text-white z-10">
              {productDiscount.discount}% OFF
            </Badge>
          )}
        </div>

        {/* Image Thumbnails */}
        {productImages.length > 1 && (
          <div className="px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                    ? 'border-red-500 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="p-4 space-y-6">
          {/* Name and Price */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{product.name}</h2>

            {/* Price with discount */}
            {productDiscount ? (
              <div className="space-y-2">
                <p className="text-lg text-slate-500 line-through">₹{product.price.toLocaleString()}</p>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-bold text-green-600">
                    ₹{Math.round(discountedPrice).toLocaleString()}
                  </p>
                  <Badge className="bg-green-500 text-white">
                    {productDiscount.discount}% OFF
                  </Badge>
                </div>
                <p className="text-sm text-green-600">
                  You save ₹{Math.round(product.price - discountedPrice).toLocaleString()}!
                </p>
              </div>
            ) : (
              <p className="text-3xl font-bold text-red-600">₹{product.price.toLocaleString()}</p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
            <span className="text-sm text-slate-500">(4.5) 120 reviews</span>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4">
            {product.brand && (
              <div>
                <p className="text-sm font-medium text-slate-900">Brand</p>
                <p className="text-sm text-slate-600">{product.brand}</p>
              </div>
            )}
            {product.material && (
              <div>
                <p className="text-sm font-medium text-slate-900">Material</p>
                <p className="text-sm text-slate-600">{product.material}</p>
              </div>
            )}
            {product.color && (
              <div>
                <p className="text-sm font-medium text-slate-900">Color</p>
                <p className="text-sm text-slate-600">{product.color}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-900">Stock</p>
              <p className="text-sm text-slate-600">{product.stock} available</p>
            </div>
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className={
                      selectedSize === size
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "border-slate-300 text-slate-600 hover:border-red-300 hover:text-red-600"
                    }
                  >
                    {size}
                  </Button>
                ))}
              </div>
              {selectedSize && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 text-center font-medium">
                    ✓ Size {selectedSize} selected - Ready to add to cart!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Add to Cart and Wishlist Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl disabled:bg-slate-300 disabled:text-slate-500"
              disabled={product.stock === 0 || (product.sizes && product.sizes.length > 0 && !selectedSize)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock === 0
                ? 'Out of Stock'
                : (product.sizes && product.sizes.length > 0 && !selectedSize)
                  ? 'Select Size First'
                  : 'Add to Cart'
              }
            </Button>

            <Button
              variant="outline"
              onClick={() => onAddToWishlist(product)}
              className={`w-full py-3 rounded-xl border-2 font-semibold ${isInWishlist
                ? 'border-pink-300 text-pink-600 bg-pink-50 hover:bg-pink-100 hover:border-pink-400'
                : 'border-slate-300 text-slate-600 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50'
                }`}
            >
              <Heart className={`w-5 h-5 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>

          {/* Size Selection Reminder */}
          {product.sizes && product.sizes.length > 0 && !selectedSize && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-sm text-red-700 text-center font-medium">
                ⚠️ Please select a size before adding to cart
              </p>
            </div>
          )}

          {/* Discount Information */}
          {productDiscount && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-green-700 font-medium">
                  🎉 You're saving ₹{Math.round(product.price - discountedPrice).toLocaleString()} with {productDiscount.discount}% discount!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}