import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "wouter";
import { useState } from "react";
import { ArrowLeft, Clock, ChevronDown, ChevronUp, FileText, Lightbulb, CheckCircle2, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { useGetGuide, getGetGuideQueryKey } from "@workspace/api-client-react";

const difficultyColor: Record<string, string> = {
  Débutant: "bg-green-100 text-green-800",
  Intermédiaire: "bg-orange-100 text-orange-800",
  Avancé: "bg-red-100 text-red-800",
};

export default function GuideDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const { data: guide, isLoading, isError, refetch } = useGetGuide(id, {
    query: { enabled: !!id, queryKey: getGetGuideQueryKey(id) },
  });

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  const toggleComplete = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Button asChild variant="ghost" className="mb-6 -ml-2">
          <Link href="/guides">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux guides
          </Link>
        </Button>

        {isLoading && <LoadingState />}
        {isError && <ErrorState onRetry={() => refetch()} />}

        {guide && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${difficultyColor[guide.difficulty] ?? "bg-muted text-muted-foreground"}`}>
                  {guide.difficulty}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {guide.duration}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> {guide.stepCount} étapes
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{guide.title}</h1>
              <p className="text-muted-foreground text-lg">{guide.summary}</p>

              {guide.tags && guide.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {guide.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}
            </motion.div>


            {/* Steps */}
            {guide.steps && guide.steps.length > 0 && (
              <div className="space-y-4">
                {guide.steps.map((step, index) => {
                  const isCompleted = completedSteps.has(index);
                  const isExpanded = expandedStep === index;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`border-2 transition-all duration-200 ${
                          isCompleted
                            ? "border-green-200 bg-green-50/30"
                            : isExpanded
                            ? "border-primary/40"
                            : "border-border hover:border-primary/20"
                        }`}
                      >
                        <div
                          onClick={() => toggleStep(index)}
                          className="w-full text-left p-6 flex items-center gap-4 cursor-pointer"
                        >
                          <button
                            onClick={(e) => toggleComplete(index, e)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-border hover:border-primary"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-display font-bold text-base md:text-lg ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                              {step.title}
                            </h3>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="px-6 pb-6 space-y-6 border-t pt-6">
                                <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                                {step.tips && step.tips.length > 0 && (
                                  <div>
                                    <h4 className="font-display font-bold flex items-center gap-2 mb-3 text-amber-700">
                                      <Lightbulb className="w-4 h-4" /> Conseils pratiques
                                    </h4>
                                    <ul className="space-y-2">
                                      {step.tips.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {step.documents && step.documents.length > 0 && (
                                  <div>
                                    <h4 className="font-display font-bold flex items-center gap-2 mb-3 text-blue-700">
                                      <FileText className="w-4 h-4" /> Documents nécessaires
                                    </h4>
                                    <ul className="space-y-2">
                                      {step.documents.map((doc, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-2 rounded-lg">
                                          <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                          {doc}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
