import { motion } from "framer-motion";
import { Link } from "wouter";
import { Briefcase, Users, GraduationCap, Heart, Scale, Home, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useListCategories } from "@workspace/api-client-react";

const iconMap: Record<string, any> = {
  Briefcase,
  Users,
  GraduationCap,
  Heart,
  Scale,
  Home,
};

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  },
};

export default function CategoriesPage() {
  const { data, isLoading, isError, refetch } = useListCategories();

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="font-display text-4xl font-bold mb-3">Catégories</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Trouve les guides et ressources adaptés à ton projet de vie en Côte d'Ivoire.
          </p>
        </motion.div>

        {isLoading && <LoadingState />}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {data && data.length === 0 && (
          <EmptyState
            title="Aucune catégorie disponible"
            description="Les catégories seront bientôt disponibles."
            icon={Briefcase}
          />
        )}
        {data && data.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger.container}
            initial="hidden"
            animate="show"
          >
            {data.map((cat) => {
              const Icon = iconMap[cat.icon] || Briefcase;
              return (
                <motion.div key={cat.id} variants={stagger.item}>
                  <Link href={`/categories/${cat.id}`}>
                    <Card className="group cursor-pointer border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-lg h-full">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${cat.color}20` }}
                          >
                            <Icon className="w-7 h-7" style={{ color: cat.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="font-display font-bold text-xl group-hover:text-primary transition-colors">{cat.name}</h2>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-6">{cat.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="font-semibold text-foreground">{cat.guideCount ?? 0}</span> guides
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-semibold text-foreground">{cat.resourceCount ?? 0}</span> ressources
                            </span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
