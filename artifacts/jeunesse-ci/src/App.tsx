import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import CategoriesPage from "@/pages/categories";
import CategoryDetailPage from "@/pages/category-detail";
import GuidesPage from "@/pages/guides";
import GuideDetailPage from "@/pages/guide-detail";
import ResourcesPage from "@/pages/resources";
import ResourceDetailPage from "@/pages/resource-detail";
import NewsPage from "@/pages/news";
import NewsDetailPage from "@/pages/news-detail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/categories/:id" component={CategoryDetailPage} />
      <Route path="/guides" component={GuidesPage} />
      <Route path="/guides/:id" component={GuideDetailPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/resources/:id" component={ResourceDetailPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/news/:id" component={NewsDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
