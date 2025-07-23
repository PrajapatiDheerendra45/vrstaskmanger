import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/authRoute.js";
import companyRoutes from "./routes/companyRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Use only express.json
app.use(express.json());

app.use(cors());
app.use('/uploads', express.static('uploads')); // serve resume files
app.use('/api/v1/candidate',candidateRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/company', companyRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
