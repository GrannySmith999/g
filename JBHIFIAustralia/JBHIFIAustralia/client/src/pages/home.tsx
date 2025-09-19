import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { CategoryGrid } from "@/components/category-grid";
import { type Product } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

  const { data: featuredProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products', 'featured=true'],
  });

  const { data: saleProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products', 'sale=true'],
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-carousel relative bg-gradient-to-br from-primary to-secondary">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4" data-testid="text-hero-title">
              {t("Samsung Sellout!")}
            </h2>
            <p className="text-xl mb-8" data-testid="text-hero-subtitle">
              {t("Massive discounts on the latest Samsung devices")}
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-secondary hover:bg-gray-100"
              data-testid="button-hero-cta"
            >
              {t("Shop Now")}
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <CategoryGrid />

      {/* Hot Deals Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-secondary" data-testid="text-deals-title">
              {t("Hot Deals")}
            </h2>
            <Button
              variant="ghost"
              className="text-primary font-medium hover:text-orange-600"
              data-testid="button-view-all-deals"
            >
              {t("View All")} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* More Categories Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-secondary" data-testid="text-mobile-section-title">
                {t("Mobile Phones & Tablets")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="iPhone"
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid="img-mobile-1"
                />
                <img
                  src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="Tablet"
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid="img-mobile-2"
                />
                <img
                  src="https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="Samsung Phone"
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid="img-mobile-3"
                />
                <img
                  src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="iPad Pro"
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid="img-mobile-4"
                />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-secondary" data-testid="text-computers-section-title">
                {t("Computers & Laptops")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="MacBook"
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid="img-computer-1"
                />
                <img
                  src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="Desktop PC"
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid="img-computer-2"
                />
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="Dell Laptop"
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid="img-computer-3"
                />
                <img
                  src="https://images.unsplash.com/photo-1547082299-de196ea013d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="HP Computer"
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid="img-computer-4"
                />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-secondary" data-testid="text-tv-section-title">
                {t("TVs & Home Theater")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="OLED TV"
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid="img-tv-1"
                />
                <img
                  src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="Sound System"
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid="img-tv-2"
                />
                <img
                  src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="Samsung TV"
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid="img-tv-3"
                />
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="Projector"
                  className="w-full h-32 object-cover rounded-lg"
                  data-testid="img-tv-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Equipment Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8" data-testid="text-audio-title">
            {t("Premium Audio Equipment")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <img
              src="https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
              alt="Sony Headphones"
              className="w-full h-48 object-cover rounded-lg"
              data-testid="img-audio-1"
            />
            <img
              src="https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
              alt="Wireless Speaker"
              className="w-full h-48 object-cover rounded-lg"
              data-testid="img-audio-2"
            />
            <img
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
              alt="Audio Equipment"
              className="w-full h-48 object-cover rounded-lg"
              data-testid="img-audio-3"
            />
            <img
              src="https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
              alt="AirPods Pro"
              className="w-full h-48 object-cover rounded-lg"
              data-testid="img-audio-4"
            />
            <img
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
              alt="Marshall Amp"
              className="w-full h-48 object-cover rounded-lg"
              data-testid="img-audio-5"
            />
            <img
              src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
              alt="Studio Monitors"
              className="w-full h-48 object-cover rounded-lg"
              data-testid="img-audio-6"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary" data-testid="text-footer-brand">
                ElectroStore
              </h3>
              <p className="text-sm text-gray-400" data-testid="text-footer-description">
                {t("Your trusted electronics retailer with the best deals on premium devices.")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" data-testid="text-footer-customer-service">
                {t("Customer Service")}
              </h4>
              <ul className="text-sm space-y-2 text-gray-400">
                <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-primary" data-testid="link-contact">{t("Contact Us")}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-primary" data-testid="link-shipping">{t("Shipping Info")}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-primary" data-testid="link-returns">{t("Returns")}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-primary" data-testid="link-warranty">{t("Warranty")}</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" data-testid="text-footer-categories">
                {t("Categories")}
              </h4>
              <ul className="text-sm space-y-2 text-gray-400">
                <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-primary" data-testid="link-mobile">{t("Mobile Phones")}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-primary" data-testid="link-computers">{t("Computers")}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-primary" data-testid="link-tvs">{t("TVs")}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-primary" data-testid="link-home-appliances">{t("Home Appliances")}</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" data-testid="text-footer-connect">
                {t("Connect With Us")}
              </h4>
              <div className="flex gap-4 mb-4">
                <Button variant="ghost" size="sm" className="p-2" data-testid="link-facebook">
                  <i className="fab fa-facebook text-xl"></i>
                </Button>
                <Button variant="ghost" size="sm" className="p-2" data-testid="link-twitter">
                  <i className="fab fa-twitter text-xl"></i>
                </Button>
                <Button variant="ghost" size="sm" className="p-2" data-testid="link-instagram">
                  <i className="fab fa-instagram text-xl"></i>
                </Button>
                <Button variant="ghost" size="sm" className="p-2" data-testid="link-telegram">
                  <i className="fab fa-telegram text-xl"></i>
                </Button>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2" data-testid="text-telegram-updates">
                  {t("Get updates via Telegram:")}
                </p>
                <Button size="sm" data-testid="button-join-telegram">
                  <i className="fab fa-telegram mr-2"></i>
                  {t("Join Channel")}
                </Button>
              </div>
            </div>
          </div>
          <hr className="my-8 border-gray-700" />
          <div className="text-center text-sm text-gray-400">
            <p data-testid="text-copyright">
              &copy; 2024 ElectroStore. {t("All rights reserved.")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
