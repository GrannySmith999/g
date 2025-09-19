import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { type Product } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useState } from "react";
import NotFound from "./not-found";

export default function ProductDetail() {
  const params = useParams();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['products', params.id],
    enabled: !!params.id,
  });

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1500);
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }

  if (error || !product) {
    return <NotFound />;
  }

  const productName = language === 'es' ? product.nameEs : product.name;
  const productDescription = language === 'es' ? product.descriptionEs : product.description;
  const hasDiscount = product.discount && product.discount > 0;
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const currentPrice = parseFloat(product.price);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-4">
            <img 
              src={product.imageUrl} 
              alt={productName} 
              className="w-full h-auto object-contain rounded-lg max-h-[500px]"
            />
          </div>

          <div className="p-6 flex flex-col">
            <CardHeader className="p-0 mb-4">
              {product.brand && <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>}
              <CardTitle className="text-3xl font-bold">{productName}</CardTitle>
            </CardHeader>

            <CardContent className="p-0 flex-grow space-y-6">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
                <span className="text-muted-foreground text-sm">(125 reviews)</span>
              </div>

              <p className="text-lg text-muted-foreground">
                {productDescription}
              </p>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-primary">${currentPrice.toFixed(2)}</span>
                {hasDiscount && originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
                )}
              </div>

              {hasDiscount && (
                <Badge className="bg-destructive text-destructive-foreground text-base">
                  Save ${product.discount}
                </Badge>
              )}
            </CardContent>

            <div className="mt-8">
              <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={isAdding || !product.inStock}>
                {isAdding ? "Added to Cart!" : t("Add to Cart")}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}