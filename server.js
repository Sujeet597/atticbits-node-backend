import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user_Routes.js";

const app = express();
configDotenv();
app.use(express.json());

app.use((req, res, next) => {
  console.log("HTTP Method - " + req.method + ", URL - " + req.url);
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

//Mount user routes
app.use("/api/user", userRoutes);

// Connect to the database
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`My Express app running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err.message);
    // Exit the process if unable to connect to the database
    process.exit(1);
  });
