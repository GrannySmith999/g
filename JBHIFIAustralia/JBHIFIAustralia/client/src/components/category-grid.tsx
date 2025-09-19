import { useQuery } from "@tanstack/react-query";
import { type Category } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";

export function CategoryGrid() {
  const { language, t } = useLanguage();
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8" data-testid="text-category-title">
          {t("Shop by Category")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-tile text-center cursor-pointer transition-transform duration-300 hover:scale-105"
              data-testid={`tile-category-${category.id}`}
            >
              <img
                src={category.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"}
                alt={language === 'es' ? category.nameEs : category.name}
                className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
                data-testid={`img-category-${category.id}`}
              />
              <h3 className="font-medium" data-testid={`text-category-name-${category.id}`}>
                {language === 'es' ? category.nameEs : category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
