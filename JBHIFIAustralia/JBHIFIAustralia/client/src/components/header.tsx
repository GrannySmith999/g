import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";

export function Header() {
  const { t } = useLanguage();
  const { getTotalItems, openCart } = useCart();

  return (
    <>
      {/* Language Switcher Bar */}
      <div className="bg-muted py-2">
        <div className="container mx-auto px-4 flex justify-end">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-secondary text-secondary-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="py-2 text-sm flex justify-between items-center">
            <span>{t("Free shipping on orders over $100!")}</span>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" data-testid="button-account">
                {t("Account")}
              </Button>
              <Button variant="ghost" size="sm" data-testid="button-help">
                {t("Help")}
              </Button>
            </div>
          </div>
          
          {/* Main header */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-primary" data-testid="text-brand">
                ElectroStore
              </h1>
              
              {/* Search */}
              <div className="hidden md:flex flex-1 max-w-md">
                <Input
                  type="search"
                  placeholder={t("Search products...")}
                  className="rounded-r-none border-r-0 bg-white text-foreground"
                  data-testid="input-search"
                />
                <Button 
                  className="rounded-l-none"
                  data-testid="button-search"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Cart */}
            <Button
              variant="ghost"
              onClick={openCart}
              className="flex items-center gap-2 hover:text-primary"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {getTotalItems()}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 py-3 overflow-x-auto">
            <Button variant="ghost" size="sm" data-testid="nav-mobile-phones">
              {t("Mobile Phones")}
            </Button>
            <Button variant="ghost" size="sm" data-testid="nav-computers">
              {t("Computers")}
            </Button>
            <Button variant="ghost" size="sm" data-testid="nav-tvs">
              {t("TVs")}
            </Button>
            <Button variant="ghost" size="sm" data-testid="nav-audio">
              {t("Audio")}
            </Button>
            <Button variant="ghost" size="sm" data-testid="nav-home-appliances">
              {t("Home Appliances")}
            </Button>
            <Button variant="ghost" size="sm" data-testid="nav-gaming">
              {t("Gaming")}
            </Button>
            <Button variant="ghost" size="sm" data-testid="nav-smart-home">
              {t("Smart Home")}
            </Button>
            <Button variant="ghost" size="sm" data-testid="nav-cameras">
              {t("Cameras")}
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
