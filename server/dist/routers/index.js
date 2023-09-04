"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("../trpc");
const users_1 = require("./users");
exports.appRouter = trpc_1.t.router({
    sayHi: trpc_1.t.procedure.query(() => {
        return "Hi";
    }),
    logToServer: trpc_1.t.procedure
        .input((v) => {
        if (typeof v === "string")
            return v;
        throw new Error("Invalid Input type, expected string");
    })
        .mutation((req) => {
        console.log(`Client Says: ${req.input}`);
        return true;
    }),
    secretData: trpc_1.adminProcedure.query(({ ctx }) => {
        console.log(ctx.user);
        return "Super Secret data";
    }),
    users: users_1.userRouter,
});
