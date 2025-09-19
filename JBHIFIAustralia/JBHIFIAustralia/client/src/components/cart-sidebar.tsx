import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";

export function CartSidebar() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { language, t } = useLanguage();

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + change);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-96 sm:max-w-96" data-testid="sidebar-cart">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span data-testid="text-cart-title">{t("Shopping Cart")}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeCart}
              data-testid="button-close-cart"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-center py-8" data-testid="text-empty-cart">
                {t("Your cart is empty")}
              </p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-3 border-b border-border"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={language === 'es' ? item.nameEs : item.name}
                      className="w-16 h-16 object-cover rounded"
                      data-testid={`img-cart-item-${item.id}`}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm" data-testid={`text-cart-item-name-${item.id}`}>
                        {language === 'es' ? item.nameEs : item.name}
                      </h4>
                      <p className="text-primary font-semibold" data-testid={`text-cart-item-price-${item.id}`}>
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 p-0"
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center" data-testid={`text-quantity-${item.id}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 p-0"
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive"
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold" data-testid="text-total-label">
                  {t("Total:")}
                </span>
                <span className="text-xl font-bold text-primary" data-testid="text-total-amount">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <Link href="/checkout">
                <Button
                  className="w-full"
                  onClick={closeCart}
                  data-testid="button-checkout"
                >
                  {t("Proceed to Checkout")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
