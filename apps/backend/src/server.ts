import { OpenAPIHono } from "@hono/zod-openapi";
import { showRoutes } from "hono/dev";
import eventHandlers from "./modules/event/handler";
import { swaggerUI } from "@hono/swagger-ui";
import { baseDocs } from "./modules/docs/base";
import { env } from "@shuffle:shared";

const baseApp = new OpenAPIHono();

// Event route
baseApp.route("/api/v1", eventHandlers);

// Health check for external services
baseApp.get("/check_health", (c) =>
  c.json({
    status: "OK",
    time: Date.now(),
  })
);

// Environment check for staring different functions based on environment
if (env.NODE_ENV === "development") {
  showRoutes(baseApp, { verbose: true });
  // Swagger UI
  baseApp.doc("/docs/spec", baseDocs);
  baseApp.get("/docs/ui", swaggerUI({ url: "/docs/spec" }));

  console.log("Shuffle API is running on port", env.PORT);
}

// Error handling. Could be used for logging, etc.
baseApp.onError((err, ctx) => {
  return ctx.text(err.message, 500);
});

export default baseApp;
