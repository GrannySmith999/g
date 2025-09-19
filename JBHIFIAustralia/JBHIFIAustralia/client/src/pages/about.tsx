import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">{t("About Us")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg text-muted-foreground">
          <p>
            {t("Welcome to ElectroStore, your number one source for all things electronics.")}
          </p>
          <p>
            {t("We're dedicated to giving you the very best of tech, with a focus on quality, customer service, and uniqueness.")}
          </p>
          <p>
            {t("Founded in 2024, ElectroStore has come a long way from its beginnings. We now serve customers all over the world, and are thrilled to be a part of the fair-trade wing of the electronics industry.")}
          </p>
          <p>
            {t("We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}