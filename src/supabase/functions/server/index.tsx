import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Route prefix as per instructions
const PREFIX = "/make-server-2abbdb9a";

// Enable logger with more detail
app.use('*', logger((...args) => console.log('[Server Log]:', ...args)));

// Enable CORS for all routes and methods
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to handle the prefix if Supabase doesn't strip it
app.use("*", async (c, next) => {
  console.log(`[Incoming Request]: ${c.req.method} ${c.req.url}`);
  await next();
});

// Health check endpoint (both with and without prefix)
app.get(`${PREFIX}/health`, (c) => c.json({ status: "ok", path: "with-prefix" }));
app.get(`/health`, (c) => c.json({ status: "ok", path: "no-prefix" }));

// Migration Drafts
const draftsRoute = `${PREFIX}/migrations/drafts`;
app.get(draftsRoute, async (c) => {
  try {
    const drafts = await kv.getByPrefix("migration:draft:");
    return c.json(drafts || []);
  } catch (error) {
    console.error("Error fetching drafts:", error);
    return c.json({ error: "Failed to fetch drafts", details: error.message }, 500);
  }
});

app.post(draftsRoute, async (c) => {
  try {
    const draft = await c.req.json();
    if (!draft.id) draft.id = crypto.randomUUID();
    draft.updatedAt = new Date().toISOString();
    await kv.set(`migration:draft:${draft.id}`, draft);
    return c.json(draft);
  } catch (error) {
    console.error("Error saving draft:", error);
    return c.json({ error: "Failed to save draft", details: error.message }, 500);
  }
});

// Active Migrations
const activeRoute = `${PREFIX}/migrations/active`;

// GET list
app.get(activeRoute, async (c) => {
  try {
    const active = await kv.getByPrefix("migration:active:");
    return c.json(active || []);
  } catch (error) {
    console.error("Error fetching active migrations:", error);
    return c.json({ error: "Failed to fetch active migrations", details: error.message }, 500);
  }
});

// POST start/update
app.post(activeRoute, async (c) => {
  try {
    const migration = await c.req.json();
    if (!migration.id) migration.id = crypto.randomUUID();
    migration.updatedAt = new Date().toISOString();
    if (!migration.startTime) migration.startTime = new Date().toISOString();
    await kv.set(`migration:active:${migration.id}`, migration);
    return c.json(migration);
  } catch (error) {
    console.error("Error saving active migration:", error);
    return c.json({ error: "Failed to save active migration", details: error.message }, 500);
  }
});

// DELETE
app.delete(`${activeRoute}/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`migration:active:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting active migration:", error);
    return c.json({ error: "Failed to delete active migration", details: error.message }, 500);
  }
});

// Fallback routes without prefix for robustness
app.get(`/migrations/active`, async (c) => {
  try {
    const active = await kv.getByPrefix("migration:active:");
    return c.json(active || []);
  } catch (error) {
    return c.json({ error: "Failed", details: error.message }, 500);
  }
});

app.post(`/migrations/active`, async (c) => {
  try {
    const migration = await c.req.json();
    if (!migration.id) migration.id = crypto.randomUUID();
    await kv.set(`migration:active:${migration.id}`, migration);
    return c.json(migration);
  } catch (error) {
    return c.json({ error: "Failed", details: error.message }, 500);
  }
});

Deno.serve(app.fetch);
