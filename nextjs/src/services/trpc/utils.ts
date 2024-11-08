import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { createTRPCNext } from "@trpc/next";
import { ssrPrepass } from '@trpc/next/ssrPrepass';
import { AppRouter } from "./router/app";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();
// export const trpc = createTRPCNext<AppRouter>({
//   ssr: true,
//   ssrPrepass,
//   transformer: superjson,
//   config(opts) {
//     const { ctx } = opts;
//     if (typeof window !== "undefined") {
//       // during client requests
//       return {
//         links: [
//           httpBatchLink({
//             url: "/api/trpc",
//             transformer: superjson,
//           }),
//         ],
//       };
//     }
//     return {
//       links: [
//         httpBatchLink({
//           transformer: superjson,
//           // The server needs to know your app's full url
//           url: `http://localhost:3000/api/trpc`,
//           /**
//            * Set custom request headers on every request from tRPC
//            * @see https://trpc.io/docs/v10/header
//            */
//           headers() {
//             if (!ctx?.req?.headers) {
//               return {};
//             }
//             // To use SSR properly, you need to forward client headers to the server
//             // This is so you can pass through things like cookies when we're server-side rendering
//             return {
//               cookie: ctx.req.headers.cookie,
//             };
//           },
//         }),
//       ],
//     };
//   },
// });
// export const trpcClient = trpc.createClient({ links: [] }); //server only?
