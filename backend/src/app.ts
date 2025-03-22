import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", taskRoutes);

export default app;
