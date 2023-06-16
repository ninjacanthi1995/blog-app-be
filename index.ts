import express from "express";
import router from "./routes/blog";
import cors from "cors";
import bodyParser from "body-parser";
import { initDB } from "./database/blog.db";

const app = express();
const port = 8000;

initDB()

app.use(bodyParser.json());
app.use(cors());
app.use("/blogs", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
