import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, AlertCircle, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { useGetNewsItem, getGetNewsItemQueryKey } from "@workspace/api-client-react";

const newsTypeColor: Record<string, string> = {
  Programme: "bg-primary/10 text-primary",
  Bourse: "bg-blue-100 text-blue-800",
  Événement: "bg-purple-100 text-purple-800",
  Opportunité: "bg-green-100 text-green-800",
  "Santé publique": "bg-red-100 text-red-800",
};

function isDeadlineSoon(deadline: string) {
  const days = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 14;
}

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);

  const { data: item, isLoading, isError, refetch } = useGetNewsItem(id, {
    query: { enabled: !!id, queryKey: getGetNewsItemQueryKey(id) },
  });

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Button asChild variant="ghost" className="mb-6 -ml-2">
          <Link href="/news">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux actualités
          </Link>
        </Button>

        {isLoading && <LoadingState />}
        {isError && <ErrorState onRetry={() => refetch()} />}

        {item && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${newsTypeColor[item.type] ?? "bg-muted text-muted-foreground"}`}>
                {item.type}
              </span>
              {item.isFeatured && (
                <Badge className="bg-primary/10 text-primary">A la une</Badge>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{item.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Publié le {new Date(item.publishedAt).toLocaleDateString("fr-CI", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              {item.source && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  Source : {item.source}
                </span>
              )}
            </div>

            {item.deadline && (
              <Card className={`mb-6 ${isDeadlineSoon(item.deadline) ? "border-orange-200 bg-orange-50/50" : "border-blue-200 bg-blue-50/30"}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 ${isDeadlineSoon(item.deadline) ? "text-orange-600" : "text-blue-600"}`} />
                  <div>
                    <p className={`font-semibold text-sm ${isDeadlineSoon(item.deadline) ? "text-orange-700" : "text-blue-700"}`}>
                      {isDeadlineSoon(item.deadline) ? "Date limite imminente" : "Date limite"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.deadline).toLocaleDateString("fr-CI", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed border-l-4 border-primary pl-4 italic">{item.summary}</p>

            {item.content && (
              <div className="prose prose-stone max-w-none">
                {item.content.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="mb-4 text-foreground/90 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
