import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { MapPin, Phone, Globe, Mail, Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import {
  useListResources,
  useListCategories,
  getListResourcesQueryKey,
} from "@workspace/api-client-react";

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

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  const categories = useListCategories();
  const resources = useListResources(
    selectedCategory ? { categoryId: selectedCategory } : undefined,
    {
      query: {
        queryKey: getListResourcesQueryKey(selectedCategory ? { categoryId: selectedCategory } : undefined),
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
          <h1 className="font-display text-4xl font-bold mb-3">Annuaire des ressources</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Trouve les organismes publics, ONG et institutions qui peuvent t'aider en Côte d'Ivoire.
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

        {resources.isLoading && <LoadingState />}
        {resources.isError && <ErrorState onRetry={() => resources.refetch()} />}
        {resources.data && resources.data.length === 0 && (
          <EmptyState
            title="Aucune ressource disponible"
            description="Aucune ressource ne correspond à vos critères."
            icon={Compass}
            actionLabel="Voir toutes les ressources"
            onAction={() => setSelectedCategory(undefined)}
          />
        )}
        {resources.data && resources.data.length > 0 && (
          <motion.div
            key={selectedCategory}
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
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-display font-bold text-base group-hover:text-primary transition-colors line-clamp-2 flex-1">{res.name}</h3>
                        <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">{res.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{res.description}</p>

                      {res.services && res.services.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {res.services.slice(0, 3).map((s) => (
                            <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                          {res.services.length > 3 && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">+{res.services.length - 3}</span>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {res.city}{res.address ? `, ${res.address}` : ""}</span>
                        {res.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {res.phone}</span>}
                        {res.website && (
                          <span className="flex items-center gap-1.5 text-primary">
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate">{res.website.replace(/^https?:\/\//, "")}</span>
                          </span>
                        )}
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
