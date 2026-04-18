import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, categoriesTable, guidesTable, resourcesTable } from "@workspace/db";
import {
  GetCategoryParams,
  GetCategoryResponse,
  ListCategoriesResponse,
} from "@workspace/api-zod";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.id);

  const guideCountsRaw = await db
    .select({ categoryId: guidesTable.categoryId, count: sql<number>`count(*)::int` })
    .from(guidesTable)
    .groupBy(guidesTable.categoryId);

  const resourceCountsRaw = await db
    .select({ categoryId: resourcesTable.categoryId, count: sql<number>`count(*)::int` })
    .from(resourcesTable)
    .groupBy(resourcesTable.categoryId);

  const guideCounts = new Map(guideCountsRaw.map((r) => [r.categoryId, r.count]));
  const resourceCounts = new Map(resourceCountsRaw.map((r) => [r.categoryId, r.count]));

  const result = categories.map((c) => ({
    ...c,
    guideCount: guideCounts.get(c.id) ?? 0,
    resourceCount: resourceCounts.get(c.id) ?? 0,
  }));

  res.json(ListCategoriesResponse.parse(result));
});

router.get("/categories/:id", async (req, res): Promise<void> => {
  const params = GetCategoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [category] = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, params.data.id));

  if (!category) {
    res.status(404).json({ error: "Catégorie non trouvée" });
    return;
  }

  const [guideCountResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(guidesTable)
    .where(eq(guidesTable.categoryId, category.id));

  const [resourceCountResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(resourcesTable)
    .where(eq(resourcesTable.categoryId, category.id));

  res.json(
    GetCategoryResponse.parse({
      ...category,
      guideCount: guideCountResult?.count ?? 0,
      resourceCount: resourceCountResult?.count ?? 0,
    })
  );
});

export default router;
