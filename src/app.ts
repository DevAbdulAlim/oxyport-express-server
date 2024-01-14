import express from "express";
import authRoutes from "./routes/authRoute";
import productRoutes from "./routes/productRoute";
import userRoutes from "./routes/userRoute";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000", // specify the origin of your React app
    credentials: true, // enable credentials
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
