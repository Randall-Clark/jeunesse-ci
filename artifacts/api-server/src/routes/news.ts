import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, newsTable } from "@workspace/db";
import {
  GetNewsItemParams,
  GetNewsItemResponse,
  ListNewsQueryParams,
  ListNewsResponse,
  ListFeaturedNewsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeNews(item: typeof newsTable.$inferSelect) {
  return {
    ...item,
    publishedAt: item.publishedAt instanceof Date ? item.publishedAt.toISOString() : item.publishedAt,
    deadline: item.deadline instanceof Date ? item.deadline.toISOString() : item.deadline,
  };
}

router.get("/news/featured", async (_req, res): Promise<void> => {
  const news = await db
    .select()
    .from(newsTable)
    .where(eq(newsTable.isFeatured, true))
    .orderBy(desc(newsTable.publishedAt));

  res.json(ListFeaturedNewsResponse.parse(news.map(serializeNews)));
});

router.get("/news", async (req, res): Promise<void> => {
  const query = ListNewsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { categoryId, type } = query.data;

  let news = await db.select().from(newsTable).orderBy(desc(newsTable.publishedAt));

  if (categoryId) {
    news = news.filter((n) => n.categoryId === categoryId);
  }
  if (type) {
    news = news.filter((n) => n.type === type);
  }

  res.json(ListNewsResponse.parse(news.map(serializeNews)));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetNewsItemParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [item] = await db
    .select()
    .from(newsTable)
    .where(eq(newsTable.id, params.data.id));

  if (!item) {
    res.status(404).json({ error: "Actualité non trouvée" });
    return;
  }

  res.json(GetNewsItemResponse.parse(serializeNews(item)));
});

export default router;
