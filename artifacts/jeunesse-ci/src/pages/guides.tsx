import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import {
  useListGuides,
  useListCategories,
  getListGuidesQueryKey,
} from "@workspace/api-client-react";

const difficultyColor: Record<string, string> = {
  Débutant: "bg-green-100 text-green-800",
  Intermédiaire: "bg-orange-100 text-orange-800",
  Avancé: "bg-red-100 text-red-800",
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

export default function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  const categories = useListCategories();
  const guides = useListGuides(
    selectedCategory ? { categoryId: selectedCategory } : undefined,
    {
      query: {
        queryKey: getListGuidesQueryKey(selectedCategory ? { categoryId: selectedCategory } : undefined),
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
          <h1 className="font-display text-4xl font-bold mb-3">Guides pratiques</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Des parcours étape par étape pour t'aider dans tes démarches en Côte d'Ivoire.
          </p>
        </motion.div>

        {/* Category Filter */}
        {categories.data && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(undefined)}
            >
              Tous
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

        {guides.isLoading && <LoadingState />}
        {guides.isError && <ErrorState onRetry={() => guides.refetch()} />}
        {guides.data && guides.data.length === 0 && (
          <EmptyState
            title="Aucun guide disponible"
            description="Aucun guide ne correspond à vos critères pour le moment."
            icon={BookOpen}
            actionLabel="Voir tous les guides"
            onAction={() => setSelectedCategory(undefined)}
          />
        )}
        {guides.data && guides.data.length > 0 && (
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger.container}
            initial="hidden"
            animate="show"
          >
            {guides.data.map((guide) => (
              <motion.div key={guide.id} variants={stagger.item}>
                <Link href={`/guides/${guide.id}`}>
                  <Card className="group cursor-pointer border hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColor[guide.difficulty] ?? "bg-muted text-muted-foreground"}`}>
                          {guide.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {guide.duration}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">{guide.title}</h3>
                      <p className="text-sm text-muted-foreground flex-1 line-clamp-3">{guide.summary}</p>
                      {guide.tags && guide.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {guide.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <span className="text-xs text-muted-foreground">{guide.stepCount} étapes</span>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
