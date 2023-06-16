"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_db_1 = require("../database/blog.db");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    const sql_getAll = `SELECT * FROM blog`;
    blog_db_1.db.all(sql_getAll, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.send(rows);
    });
});
router.get("/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM blog WHERE id = ?";
    blog_db_1.db.get(sql, id, (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        res.send(row);
    });
});
router.post("/", (req, res) => {
    const sql = "INSERT INTO blog (title, content, createdAt, createdBy) VALUES (?, ?, ?, ?)";
    const blog = [req.body.title, req.body.content, Date.now(), req.body.createdBy];
    blog_db_1.db.run(sql, blog, err => {
        if (err) {
            return console.error(err.message);
        }
        res.send("Blog created");
    });
});
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const blog = [req.body.title, req.body.createdBy, req.body.content, id];
    const sql = "UPDATE blog SET title = ?, createdBy = ?, content = ? WHERE (id = ?)";
    blog_db_1.db.run(sql, blog, err => {
        if (err) {
            return console.error(err.message);
        }
        res.send("Blog updated");
    });
});
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM blog WHERE id = ?";
    blog_db_1.db.run(sql, id, err => {
        if (err) {
            return console.error(err.message);
        }
        res.send("Blog deleted");
    });
});
router.get("/search/text", (req, res) => {
    console.log('query', req.query);
    const text = decodeURI((req.query.text || '').toString());
    console.log('text', text);
    const sql_searchBlog = `SELECT * FROM blog_fts WHERE blog_fts MATCH ?`;
    blog_db_1.db.all(sql_searchBlog, [text], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.send(rows);
    });
});
exports.default = router;
