import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./routes";
import { log } from "./config";

const app = express();

// Configure CORS
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    origin: true
}));

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});

// Mount API routes
app.use("/v1", routes);

// Centralized error handler to keep responses consistent
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    log.error(`Internal Server Error: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
});

export default app;
