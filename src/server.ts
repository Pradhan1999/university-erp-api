import express from "express";
import subjectsRouter from "./routes/subjects.route";
import classesRouter from "./routes/classes.route";
import usersRouter from "./routes/users.route";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./lib/auth";

const app = express();
const PORT = 8000;

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined in environment variables");
}
// Middleware to handle CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// Authentication routes
app.all("/api/auth/*splat", toNodeHandler(auth));

// Middleware to parse JSON
app.use(express.json());

// ROUTES
app.use("/api/v1/subjects", subjectsRouter);
app.use("/api/v1/classes", classesRouter);
app.use("/api/v1/users", usersRouter);

// Root GET route and check db is connected
app.get("/", (req, res) => {
  res.json({ message: "University ERP API is running!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
