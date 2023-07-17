import "dotenv/config";
import express from "express";
import routes from "./routes";
import connectDB from "./db/connect";
import cors from "cors";

const app = express();
connectDB();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use("/api", routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("App escuchando en puerto:", PORT);
});
