import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, resourcesTable } from "@workspace/db";
import {
  GetResourceParams,
  GetResourceResponse,
  ListResourcesQueryParams,
  ListResourcesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/resources", async (req, res): Promise<void> => {
  const query = ListResourcesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { categoryId, type } = query.data;

  let resources = await db.select().from(resourcesTable).orderBy(resourcesTable.id);

  if (categoryId) {
    resources = resources.filter((r) => r.categoryId === categoryId);
  }
  if (type) {
    resources = resources.filter((r) => r.type === type);
  }

  res.json(ListResourcesResponse.parse(resources));
});

router.get("/resources/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetResourceParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [resource] = await db
    .select()
    .from(resourcesTable)
    .where(eq(resourcesTable.id, params.data.id));

  if (!resource) {
    res.status(404).json({ error: "Ressource non trouvée" });
    return;
  }

  res.json(GetResourceResponse.parse(resource));
});

export default router;
