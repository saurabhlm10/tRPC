"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const observable_1 = require("@trpc/server/observable");
const stream_1 = require("stream");
const userProcedure = trpc_1.t.procedure.input(zod_1.z.object({ userId: zod_1.z.string() }));
const eventEmitter = new stream_1.EventEmitter();
exports.userRouter = trpc_1.t.router({
    get: userProcedure.query(({ input }) => {
        return { id: input.userId, name: "Saurabh" };
    }),
    update: userProcedure
        .input(zod_1.z.object({ name: zod_1.z.string() }))
        .output(zod_1.z.object({ id: zod_1.z.string(), name: zod_1.z.string() }))
        .mutation((req) => {
        eventEmitter.emit("update", JSON.stringify({
            id: req.input.userId,
            name: req.input.name,
        }));
        return { id: req.input.userId, name: req.input.name };
    }),
    onUpdate: trpc_1.t.procedure.subscription(() => {
        return (0, observable_1.observable)((emit) => {
            eventEmitter.on("update", emit.next);
            return () => {
                eventEmitter.off("update", emit.next);
            };
        });
    }),
});
