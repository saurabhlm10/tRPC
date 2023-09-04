import express from "express";
import cors from "cors";

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./routers";

import { createContext } from "./context";

import ws from "ws";

const app = express();

app.use(cors());
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const server = app.listen(3000);

applyWSSHandler({
  wss: new ws.Server({ server }),
  router: appRouter,
  createContext,
});

export type AppRouter = typeof appRouter;
