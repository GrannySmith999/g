import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export function LanguageSwitcher() {
  const { language, switchLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLanguage('en')}
        data-testid="button-language-en"
      >
        English
      </Button>
      <Button
        variant={language === 'es' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLanguage('es')}
        data-testid="button-language-es"
      >
        Español
      </Button>
    </div>
  );
}
