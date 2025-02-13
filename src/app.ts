import express from "express";
import authRoutes from "./routes/authRoute";
import productRoutes from "./routes/productRoute";
import orderRoutes from "./routes/orderRoute";
import userRoutes from "./routes/userRoute";
import categoryRoutes from "./routes/categoryRoute";
import paymentRoutes from "./routes/paymentRoute";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname.replace(/\s+/g, "_");
    cb(null, originalName);
  },
});

const upload = multer({ storage: storage });

// Apply multer middleware to all routes
app.use(upload.any());

// Serve static files from the "public/images" directory
// app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use(express.static("public"));

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", orderRoutes);
app.use("/api", productRoutes);
app.use("/api", userRoutes);
app.use("/api", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
