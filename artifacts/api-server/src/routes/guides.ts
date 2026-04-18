import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, guidesTable, guideStepsTable } from "@workspace/db";
import {
  GetGuideParams,
  GetGuideResponse,
  ListGuidesQueryParams,
  ListGuidesResponse,
  ListFeaturedGuidesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/guides/featured", async (_req, res): Promise<void> => {
  const guides = await db
    .select()
    .from(guidesTable)
    .where(eq(guidesTable.isFeatured, true))
    .orderBy(guidesTable.id);

  res.json(ListFeaturedGuidesResponse.parse(guides));
});

router.get("/guides", async (req, res): Promise<void> => {
  const query = ListGuidesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { categoryId } = query.data;

  const guides = categoryId
    ? await db
        .select()
        .from(guidesTable)
        .where(eq(guidesTable.categoryId, categoryId))
        .orderBy(guidesTable.id)
    : await db.select().from(guidesTable).orderBy(guidesTable.id);

  res.json(ListGuidesResponse.parse(guides));
});

router.get("/guides/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetGuideParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [guide] = await db
    .select()
    .from(guidesTable)
    .where(eq(guidesTable.id, params.data.id));

  if (!guide) {
    res.status(404).json({ error: "Guide non trouvé" });
    return;
  }

  const steps = await db
    .select()
    .from(guideStepsTable)
    .where(eq(guideStepsTable.guideId, guide.id))
    .orderBy(guideStepsTable.order);

  res.json(GetGuideResponse.parse({ ...guide, steps }));
});

export default router;
