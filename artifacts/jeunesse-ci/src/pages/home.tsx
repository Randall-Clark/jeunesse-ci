import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Briefcase, Users, GraduationCap, Heart, Scale, Home, ChevronRight, Clock, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { LoadingState, ErrorState } from "@/components/ui/states";
import {
  useListCategories,
  useListFeaturedGuides,
  useListFeaturedNews,
  useGetStatsSummary,
} from "@workspace/api-client-react";

const iconMap: Record<string, any> = {
  Briefcase,
  Users,
  GraduationCap,
  Heart,
  Scale,
  Home,
};

const difficultyColor: Record<string, string> = {
  Débutant: "bg-green-100 text-green-800",
  Intermédiaire: "bg-orange-100 text-orange-800",
  Avancé: "bg-red-100 text-red-800",
};

const newsTypeColor: Record<string, string> = {
  Programme: "bg-primary/10 text-primary",
  Bourse: "bg-blue-100 text-blue-800",
  Événement: "bg-purple-100 text-purple-800",
  Opportunité: "bg-green-100 text-green-800",
  "Santé publique": "bg-red-100 text-red-800",
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

export default function HomePage() {
  const categories = useListCategories();
  const featuredGuides = useListFeaturedGuides();
  const featuredNews = useListFeaturedNews();
  const stats = useGetStatsSummary();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/95 to-primary pt-20 pb-28 px-4">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto max-w-4xl text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm px-4 py-1">
              Plateforme d'orientation pour la jeunesse ivoirienne
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Ton avenir commence<br />
              <span className="text-white/80">par la bonne information</span>
            </h1>
            <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Guides pratiques, ressources officielles et actualités pour t'aider à prendre les meilleures décisions — entrepreneuriat, emploi, formation, santé et droits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold text-base px-8 h-12">
                <Link href="/guides">
                  Explorer les guides
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 font-semibold text-base px-8 h-12">
                <Link href="/categories">
                  Voir les catégories
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      {stats.data && (
        <section className="bg-card border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Guides pratiques", value: stats.data.totalGuides },
                { label: "Ressources", value: stats.data.totalResources },
                { label: "Opportunités", value: stats.data.totalNews },
                { label: "Catégories", value: stats.data.totalCategories },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <p className="font-display text-3xl font-bold text-primary">{stat.value}+</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold">Que veux-tu faire ?</h2>
              <p className="text-muted-foreground mt-2">Choisis ton domaine pour trouver les bons guides et ressources</p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/categories">
                Tout voir <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {categories.isLoading && <LoadingState />}
          {categories.isError && <ErrorState onRetry={() => categories.refetch()} />}
          {categories.data && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              variants={stagger.container}
              initial="hidden"
              animate="show"
            >
              {categories.data.map((cat) => {
                const Icon = iconMap[cat.icon] || Briefcase;
                return (
                  <motion.div key={cat.id} variants={stagger.item}>
                    <Link href={`/categories/${cat.id}`}>
                      <Card className="group cursor-pointer border-2 hover:border-primary/40 transition-all duration-200 hover:shadow-md h-full">
                        <CardContent className="p-6">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${cat.color}20` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: cat.color }} />
                          </div>
                          <h3 className="font-display font-bold text-lg mb-1">{cat.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                          <div className="flex gap-3 mt-4">
                            <span className="text-xs text-muted-foreground">{cat.guideCount ?? 0} guides</span>
                            <span className="text-xs text-muted-foreground">{cat.resourceCount ?? 0} ressources</span>
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
      </section>

      {/* Featured Guides */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold">Guides populaires</h2>
              <p className="text-muted-foreground mt-2">Les parcours les plus consultés par les jeunes ivoiriens</p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/guides">
                Tous les guides <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {featuredGuides.isLoading && <LoadingState />}
          {featuredGuides.isError && <ErrorState onRetry={() => featuredGuides.refetch()} />}
          {featuredGuides.data && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={stagger.container}
              initial="hidden"
              animate="show"
            >
              {featuredGuides.data.map((guide) => (
                <motion.div key={guide.id} variants={stagger.item}>
                  <Link href={`/guides/${guide.id}`}>
                    <Card className="group cursor-pointer border hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColor[guide.difficulty] ?? "bg-muted text-muted-foreground"}`}>
                            {guide.difficulty}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {guide.duration}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground flex-1 line-clamp-3">{guide.summary}</p>
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
      </section>

      {/* Latest News */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold">Actualités & Opportunités</h2>
              <p className="text-muted-foreground mt-2">Ne rate aucune opportunité pour les jeunes en Côte d'Ivoire</p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/news">
                Toutes les actu <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {featuredNews.isLoading && <LoadingState />}
          {featuredNews.isError && <ErrorState onRetry={() => featuredNews.refetch()} />}
          {featuredNews.data && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={stagger.container}
              initial="hidden"
              animate="show"
            >
              {featuredNews.data.map((item) => (
                <motion.div key={item.id} variants={stagger.item}>
                  <Link href={`/news/${item.id}`}>
                    <Card className="group cursor-pointer border hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${newsTypeColor[item.type] ?? "bg-muted text-muted-foreground"}`}>
                            {item.type}
                          </span>
                          {item.deadline && (
                            <span className="text-xs text-orange-600 font-medium">
                              Date limite : {new Date(item.deadline).toLocaleDateString("fr-CI")}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground flex-1 line-clamp-3">{item.summary}</p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.publishedAt).toLocaleDateString("fr-CI", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
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
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à passer à l'action ?
            </h2>
            <p className="text-white/75 text-lg mb-8">
              Consulte nos guides détaillés, trouve les ressources près de chez toi et reste informé des dernières opportunités.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-10 h-12">
              <Link href="/guides">
                Commencer maintenant <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
