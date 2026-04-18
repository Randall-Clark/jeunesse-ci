import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, MapPin, Phone, Globe, Mail, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { useGetResource, getGetResourceQueryKey } from "@workspace/api-client-react";

export default function ResourceDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);

  const { data: resource, isLoading, isError, refetch } = useGetResource(id, {
    query: { enabled: !!id, queryKey: getGetResourceQueryKey(id) },
  });

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Button asChild variant="ghost" className="mb-6 -ml-2">
          <Link href="/resources">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour à l'annuaire
          </Link>
        </Button>

        {isLoading && <LoadingState />}
        {isError && <ErrorState onRetry={() => refetch()} />}

        {resource && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-3">{resource.type}</Badge>
                <h1 className="font-display text-3xl font-bold mb-3">{resource.name}</h1>
                <p className="text-muted-foreground text-lg">{resource.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-display font-bold text-lg mb-4">Coordonnées</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>{resource.city}{resource.address ? `, ${resource.address}` : ""}</span>
                    </div>
                    {resource.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a href={`tel:${resource.phone}`} className="text-primary hover:underline">{resource.phone}</a>
                      </div>
                    )}
                    {resource.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a href={`mailto:${resource.email}`} className="text-primary hover:underline">{resource.email}</a>
                      </div>
                    )}
                    {resource.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                          {resource.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                    {resource.openingHours && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span>{resource.openingHours}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {resource.services && resource.services.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-display font-bold text-lg mb-4">Services proposés</h2>
                    <ul className="space-y-2">
                      {resource.services.map((service, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {resource.website && (
              <Button asChild size="lg" className="w-full md:w-auto">
                <a href={resource.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" /> Visiter le site officiel
                </a>
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
