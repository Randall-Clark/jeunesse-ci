import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { Calendar, AlertCircle, Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import {
  useListNews,
  useListCategories,
  getListNewsQueryKey,
} from "@workspace/api-client-react";

const newsTypeColor: Record<string, string> = {
  Programme: "bg-primary/10 text-primary border-primary/20",
  Bourse: "bg-blue-100 text-blue-800 border-blue-200",
  Événement: "bg-purple-100 text-purple-800 border-purple-200",
  Opportunité: "bg-green-100 text-green-800 border-green-200",
  "Santé publique": "bg-red-100 text-red-800 border-red-200",
};

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  },
};

function isDeadlineSoon(deadline: string) {
  const days = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 14;
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  const categories = useListCategories();
  const news = useListNews(
    selectedCategory ? { categoryId: selectedCategory } : undefined,
    {
      query: {
        queryKey: getListNewsQueryKey(selectedCategory ? { categoryId: selectedCategory } : undefined),
      },
    }
  );

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-bold mb-3">Actualités & Opportunités</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Programmes, bourses, événements et opportunités pour les jeunes en Côte d'Ivoire.
          </p>
        </motion.div>

        {categories.data && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(undefined)}
            >
              Toutes
            </Button>
            {categories.data.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? undefined : cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        )}

        {news.isLoading && <LoadingState />}
        {news.isError && <ErrorState onRetry={() => news.refetch()} />}
        {news.data && news.data.length === 0 && (
          <EmptyState
            title="Aucune actualité disponible"
            description="Revenez bientôt pour les dernières nouvelles."
            icon={Newspaper}
            actionLabel="Voir toutes les actualités"
            onAction={() => setSelectedCategory(undefined)}
          />
        )}
        {news.data && news.data.length > 0 && (
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={stagger.container}
            initial="hidden"
            animate="show"
          >
            {news.data.map((item) => {
              const deadlineSoon = item.deadline && isDeadlineSoon(item.deadline);
              return (
                <motion.div key={item.id} variants={stagger.item}>
                  <Link href={`/news/${item.id}`}>
                    <Card className={`group cursor-pointer border hover:shadow-md transition-all duration-200 h-full ${
                      deadlineSoon ? "border-orange-200 hover:border-orange-300" : "hover:border-primary/40"
                    }`}>
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${newsTypeColor[item.type] ?? "bg-muted text-muted-foreground border-border"}`}>
                            {item.type}
                          </span>
                          {deadlineSoon && (
                            <span className="text-xs text-orange-600 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Urgent
                            </span>
                          )}
                          {item.isFeatured && (
                            <Badge className="text-xs bg-primary/10 text-primary border-primary/20">A la une</Badge>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground flex-1 line-clamp-3">{item.summary}</p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-muted-foreground flex-wrap gap-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.publishedAt).toLocaleDateString("fr-CI", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                          {item.deadline && (
                            <span className={`font-medium ${deadlineSoon ? "text-orange-600" : "text-muted-foreground"}`}>
                              Limite : {new Date(item.deadline).toLocaleDateString("fr-CI")}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
