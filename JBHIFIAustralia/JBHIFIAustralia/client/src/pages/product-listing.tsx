import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { type Product } from "@shared/schema";
import { ProductCard } from "@/components/product-card";
import { useLanguage } from "@/hooks/use-language";

export default function ProductListing() {
  const [location] = useLocation();
  const { t } = useLanguage();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const query = searchParams.get("q");

  const queryKey = ['/api/products', location.search];

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: queryKey,
  });

  const getPageTitle = () => {
    if (query) {
      return `${t("Search Results for:")} "${query}"`;
    }
    if (category) {
      // Capitalize the first letter of each word in the category
      const formattedCategory = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return formattedCategory;
    }
    return t("All Products");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-secondary">
        {getPageTitle()}
      </h1>

      {isLoading && (
        <div className="text-center text-muted-foreground">Loading products...</div>
      )}

      {error && (
        <div className="text-center text-red-500">Error loading products.</div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="text-center text-muted-foreground">
          {t("No products found.")}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}