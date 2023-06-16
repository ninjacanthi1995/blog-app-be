"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_1 = __importDefault(require("./routes/blog"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const blog_db_1 = require("./database/blog.db");
const app = (0, express_1.default)();
const port = 8000;
(0, blog_db_1.initDB)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use("/blogs", blog_1.default);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
