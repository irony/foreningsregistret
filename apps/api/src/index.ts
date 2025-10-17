import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";

import associationsRouter from "./routes/associations";
import healthRouter from "./routes/health";

const app = new OpenAPIHono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// OpenAPI dokumentation
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Föreningsregister API",
    description:
      "API för att hämta data från svenska kommunala föreningsregister",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Development server",
    },
  ],
});

app.get("/swagger", swaggerUI({ url: "/doc" }));

// Routes
app.route("/api/health", healthRouter);
app.route("/api/associations", associationsRouter);

// Root endpoint
app.get("/", (c) => {
  return c.json({
    message: "Föreningsregister API",
    version: "1.0.0",
    documentation: "/swagger",
    endpoints: {
      health: "/api/health",
      associations: "/api/associations",
      docs: "/doc",
    },
  });
});

// Error handling
app.onError((err, c) => {
  console.error(err);
  return c.json(
    {
      success: false,
      error: "Internal server error",
      message: err.message,
    },
    500,
  );
});

// 404 handling
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: "Not found",
    },
    404,
  );
});

const port = process.env.PORT || 3001;

console.log(`🚀 Server is running on port ${port}`);
console.log(`📚 Swagger UI: http://localhost:${port}/swagger`);
console.log(`📄 OpenAPI spec: http://localhost:${port}/doc`);

serve({
  fetch: app.fetch,
  port,
});
