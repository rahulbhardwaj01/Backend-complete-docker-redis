import express from "express";
import userRouter from "./router/userRouter.js";
import todoRouter from "./router/todoRouter.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./db/database.js";
import cors from "cors";
import { Redis } from "ioredis";
import axios from "axios";

const app = express();
dotenv.config();

const redisClient = new Redis();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({ origin: "*", credentials: true }));

connectDB();


// how redis setup is done
app.get("/posts", async (req, res) => {
  try {
    console.log("Checking Redis cache...");
    const response = await redisClient.get("posts");
    if (response) {
      return res.json(JSON.parse(response));
    } else {
      console.log("Fetching data from API...");
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      await redisClient.set("posts", JSON.stringify(data));
      return res.json(data);
    }
  } catch (error) {
    console.log(error);
  }
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/todo", todoRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});