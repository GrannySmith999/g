import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";
import { ProductCard } from "@/components/product-card";
import { useLanguage } from "@/hooks/use-language";

interface RelatedProductsProps {
  categoryId?: string | null;
  currentProductId: string;
}

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const { t } = useLanguage();

  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ['products', `?category=${categoryId}&limit=4&exclude=${currentProductId}`],
    enabled: !!categoryId,
  });

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-secondary mb-8" data-testid="related-products-title">
          {t("Related Products")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}