import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import guidesRouter from "./guides";
import resourcesRouter from "./resources";
import newsRouter from "./news";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(guidesRouter);
router.use(resourcesRouter);
router.use(newsRouter);
router.use(statsRouter);

export default router;
