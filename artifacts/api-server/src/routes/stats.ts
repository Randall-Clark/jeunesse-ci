import { Router, type IRouter } from "express";
import { db, categoriesTable, guidesTable, resourcesTable, newsTable } from "@workspace/db";
import { GetStatsSummaryResponse } from "@workspace/api-zod";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const [totalGuidesResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(guidesTable);

  const [totalResourcesResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(resourcesTable);

  const [totalNewsResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(newsTable);

  const [totalCategoriesResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(categoriesTable);

  const guidesByCategory = await db
    .select({
      categoryId: guidesTable.categoryId,
      count: sql<number>`count(*)::int`,
    })
    .from(guidesTable)
    .groupBy(guidesTable.categoryId);

  const categories = await db.select().from(categoriesTable);
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const resourcesByType = await db
    .select({
      type: resourcesTable.type,
      count: sql<number>`count(*)::int`,
    })
    .from(resourcesTable)
    .groupBy(resourcesTable.type);

  res.json(
    GetStatsSummaryResponse.parse({
      totalGuides: totalGuidesResult?.count ?? 0,
      totalResources: totalResourcesResult?.count ?? 0,
      totalNews: totalNewsResult?.count ?? 0,
      totalCategories: totalCategoriesResult?.count ?? 0,
      guidesByCategory: guidesByCategory.map((g) => ({
        categoryId: g.categoryId,
        categoryName: categoryMap.get(g.categoryId) ?? "Inconnu",
        count: g.count,
      })),
      resourcesByType: resourcesByType.map((r) => ({
        type: r.type,
        count: r.count,
      })),
    })
  );
});

export default router;
