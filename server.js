import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/authRoute.js";
import companyRoutes from "./routes/companyRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Use only express.json
app.use(express.json());





app.use(cors());
app.use('/uploads', express.static('uploads')); // serve resume files
app.use('/api/v1/candidate',candidateRoutes);
app.use('/api/v1/task', taskRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/interview', interviewRoutes);
app.use("/api/v1/event", eventRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.get('/', (req, res) => {
  res.send('Task Manager API is working ✅');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
