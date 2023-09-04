import { z } from "zod";
import { t } from "../trpc";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "stream";

const userProcedure = t.procedure.input(z.object({ userId: z.string() }));

const eventEmitter = new EventEmitter();

export const userRouter = t.router({
  get: userProcedure.query(({ input }) => {
    return { id: input.userId, name: "Saurabh" };
  }),
  update: userProcedure
    .input(z.object({ name: z.string() }))
    .output(z.object({ id: z.string(), name: z.string() }))
    .mutation((req) => {
      eventEmitter.emit(
        "update",
        JSON.stringify({
          id: req.input.userId,
          name: req.input.name,
        })
      );
      return { id: req.input.userId, name: req.input.name };
    }),
  onUpdate: t.procedure.subscription(() => {
    return observable<string>((emit) => {
      eventEmitter.on("update", emit.next);

      return () => {
        eventEmitter.off("update", emit.next);
      };
    });
  }),
});
