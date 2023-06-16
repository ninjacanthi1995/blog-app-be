import express, { Request, Response } from "express";
import { db } from "../database/blog.db";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const sql_getAll = `SELECT * FROM blog`;
  db.all(sql_getAll, [], (err, rows) => {
    if (err) {
      return res.send(err.message)
    }
    res.send(rows);
  });
});

router.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const sql = "SELECT * FROM blog WHERE id = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return res.send(err.message)
    }
    res.send(row);
  });
});

router.post("/", (req: Request, res: Response) => {
  const sql = "INSERT INTO blog (title, content, createdAt, createdBy) VALUES (?, ?, ?, ?)";
  const blog = [req.body.title, req.body.content, Date.now(), req.body.createdBy];
  db.run(sql, blog, err => {
    if (err) {
      return res.send(err.message)
    }
    res.send("Blog created");
  });
});

router.put("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const blog = [req.body.title, req.body.createdBy, req.body.content, id];
  const sql = "UPDATE blog SET title = ?, createdBy = ?, content = ? WHERE (id = ?)";
  db.run(sql, blog, err => {
    if (err) {
      return res.send(err.message)
    }
    res.send("Blog updated");
  });
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const sql = "DELETE FROM blog WHERE id = ?";
  db.run(sql, id, err => {
    if (err) {
      return res.send(err.message)
    }
    res.send("Blog deleted");
  });
});

router.get("/search/text", (req: Request, res: Response) => {
  const text = decodeURI((req.query.text || '').toString())
  const sql_searchBlog = `SELECT * FROM blog_fts WHERE blog_fts MATCH ?`;
  db.all(sql_searchBlog, [text], (err, rows) => {
    if (err) {
      return res.send(err.message)
    }
    res.send(rows);
  });
});

export default router;
