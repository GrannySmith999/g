import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Product } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const productName = language === 'es' ? product.nameEs : product.name;
  const hasDiscount = product.discount && product.discount > 0;
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const currentPrice = parseFloat(product.price);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addToCart(product);
    
    // Show feedback for 1.5 seconds
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  return (
    <Card className="product-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" data-testid={`card-product-${product.id}`}>
      <CardContent className="p-4">
        <div className="relative mb-4">
          {hasDiscount && (
            <Badge 
              className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold"
              data-testid={`badge-discount-${product.id}`}
            >
              ${product.discount} {t("OFF")}
            </Badge>
          )}
          <img
            src={product.imageUrl}
            alt={productName}
            className="w-full h-48 object-cover rounded"
            data-testid={`img-product-${product.id}`}
          />
        </div>
        
        {product.brand && (
          <div className="mb-2">
            <span className="text-sm font-medium text-muted-foreground" data-testid={`text-brand-${product.id}`}>
              {product.brand}
            </span>
          </div>
        )}
        
        <h3 className="font-semibold mb-2 line-clamp-2" data-testid={`text-name-${product.id}`}>
          {productName}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${product.id}`}>
              ${originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
            ${currentPrice.toFixed(2)}
          </span>
        </div>
        
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isAdding || !product.inStock}
          data-testid={`button-add-cart-${product.id}`}
        >
          {isAdding ? "Added!" : t("Add to Cart")}
        </Button>
      </CardContent>
    </Card>
  );
}
