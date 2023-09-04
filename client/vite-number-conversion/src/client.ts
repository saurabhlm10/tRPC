import {
  createTRPCProxyClient,
  httpBatchLink,
  TRPCClientError,
  createWSClient,
  wsLink,
  splitLink,
} from "@trpc/client";
import { AppRouter } from "../../../server/api";

const wsClient = createWSClient({
  url: "ws://localhost:3000/trpc",
});

const client = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => {
        return op.type === "subscription";
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: "http://localhost:3000/trpc",
      }),
    }),
  ],
});

async function main() {
  try {
    client.users.onUpdate.subscribe(undefined, {
      onData: (data) => {
        const result = JSON.parse(data);
        console.log(result.id);
        console.log(result.name);
        console.log("Updates", JSON.parse(data));
      },
    });
    // const result = await client.secretData.query();

    // console.log(result);
  } catch (error) {
    if (error instanceof TRPCClientError) {
      console.log(error.message);
    }
  }
}

async function close() {
  wsClient.close();
}

async function side() {
  try {
    const result = await client.users.update.mutate({
      userId: "1",
      name: "Saurabh",
    });

    console.log(result);
  } catch (error) {
    if (error instanceof TRPCClientError) {
      console.log(error.message);
    }
  }
}

await main();

await side();
await side();
await close();
