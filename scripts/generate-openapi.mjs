import { generateOpenAPIDocument } from "@trpc/openapi";
import { writeFileSync } from "fs";
import { resolve } from "path";

const doc = await generateOpenAPIDocument(
  resolve("./src/services/serverFunctions/appRouter.ts"),
  {
    exportName: "trpcAppRouter",
    title: "Canvas Management API",
    version: "1.0.0",
  },
);

doc.servers = [{ url: "/api/trpc" }];

writeFileSync("public/openapi.json", JSON.stringify(doc, null, 2));
console.log("OpenAPI document written to public/openapi.json");
