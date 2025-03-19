import express from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

const app = express();

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", taskRoutes);

export default app;
