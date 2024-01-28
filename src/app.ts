import express from "express";
import authRoutes from "./routes/authRoute";
import productRoutes from "./routes/productRoute";
import userRoutes from "./routes/userRoute";
import categoryRoutes from "./routes/categoryRoute";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Configure multer middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Apply multer middleware to all routes
app.use(upload.any()); // This will parse all types of multipart/form-data

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
