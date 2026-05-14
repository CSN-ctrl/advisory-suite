import "./load-env.js";
import express from "express";
import helmet from "helmet";

const app = express();
const port = Number(process.env.API_PORT || 8787);

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
