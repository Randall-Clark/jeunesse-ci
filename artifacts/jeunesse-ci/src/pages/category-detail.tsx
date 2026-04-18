import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { Briefcase, Users, GraduationCap, Heart, Scale, Home, ArrowLeft, Clock, ChevronRight, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import {
  useGetCategory,
  useListGuides,
  useListResources,
  getGetCategoryQueryKey,
  getListGuidesQueryKey,
  getListResourcesQueryKey,
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

export default function CategoryDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);

  const category = useGetCategory(id, {
    query: { enabled: !!id, queryKey: getGetCategoryQueryKey(id) },
  });
  const guides = useListGuides(
    { categoryId: id },
    { query: { enabled: !!id, queryKey: getListGuidesQueryKey({ categoryId: id }) } }
  );
  const resources = useListResources(
    { categoryId: id },
    { query: { enabled: !!id, queryKey: getListResourcesQueryKey({ categoryId: id }) } }
  );

  const Icon = category.data ? (iconMap[category.data.icon] || Briefcase) : Briefcase;

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <Button asChild variant="ghost" className="mb-6 -ml-2">
          <Link href="/categories">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux catégories
          </Link>
        </Button>

        {category.isLoading && <LoadingState />}
        {category.isError && <ErrorState onRetry={() => category.refetch()} />}

        {category.data && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-6 mb-10"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${category.data.color}20` }}
              >
                <Icon className="w-8 h-8" style={{ color: category.data.color }} />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{category.data.name}</h1>
                <p className="text-muted-foreground text-lg">{category.data.description}</p>
                <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                  <span><strong className="text-foreground">{category.data.guideCount ?? 0}</strong> guides</span>
                  <span><strong className="text-foreground">{category.data.resourceCount ?? 0}</strong> ressources</span>
                </div>
              </div>
            </motion.div>

            <Tabs defaultValue="guides">
              <TabsList className="mb-8">
                <TabsTrigger value="guides">Guides pratiques</TabsTrigger>
                <TabsTrigger value="resources">Ressources & Organismes</TabsTrigger>
              </TabsList>

              <TabsContent value="guides">
                {guides.isLoading && <LoadingState />}
                {guides.isError && <ErrorState onRetry={() => guides.refetch()} />}
                {guides.data && guides.data.length === 0 && (
                  <EmptyState
                    title="Aucun guide disponible"
                    description="Des guides seront bientôt ajoutés pour cette catégorie."
                    icon={Briefcase}
                  />
                )}
                {guides.data && guides.data.length > 0 && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
                              <p className="text-sm text-muted-foreground flex-1 line-clamp-2">{guide.summary}</p>
                              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <span className="text-xs text-muted-foreground">{guide.stepCount} étapes</span>
                                <ChevronRight className="w-4 h-4 text-primary" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="resources">
                {resources.isLoading && <LoadingState />}
                {resources.isError && <ErrorState onRetry={() => resources.refetch()} />}
                {resources.data && resources.data.length === 0 && (
                  <EmptyState
                    title="Aucune ressource disponible"
                    description="Des ressources seront bientôt ajoutées pour cette catégorie."
                    icon={Briefcase}
                  />
                )}
                {resources.data && resources.data.length > 0 && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={stagger.container}
                    initial="hidden"
                    animate="show"
                  >
                    {resources.data.map((res) => (
                      <motion.div key={res.id} variants={stagger.item}>
                        <Link href={`/resources/${res.id}`}>
                          <Card className="group cursor-pointer border hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-display font-bold text-base group-hover:text-primary transition-colors">{res.name}</h3>
                                <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">{res.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{res.description}</p>
                              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {res.city}</span>
                                {res.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {res.phone}</span>}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
}
