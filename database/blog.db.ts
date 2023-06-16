import path from "path";
import sqlite3 from "sqlite3";

const db_name = path.join(__dirname, "blogs.db");
export const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'blogs.db'");
});

export const initDB = () => {
  const sql_create = `CREATE TABLE IF NOT EXISTS blog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    createdBy VARCHAR(100) NOT NULL,
    createdAt DATE
  );`;

  db.run(sql_create, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of the 'blog' table");
  });

  const sql_fts = `CREATE VIRTUAL TABLE blog_fts USING fts5(
    id UNINDEXED,
    title,
    content,
    createdAt UNINDEXED,
    createdBy UNINDEXED,
    content='blog',
    content_rowid='id'
  )`;

  db.run(sql_fts, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of the 'blog_fts' table");
  });

  const sql_trigger = `
  CREATE TRIGGER blog_ai AFTER INSERT ON blog
    BEGIN
      INSERT INTO blog_fts (rowid, title, content)
      VALUES (new.id, new.title, new.content);
    END;
  
  CREATE TRIGGER blog_ad AFTER DELETE ON blog
    BEGIN
      INSERT INTO blog_fts (blog_fts, rowid, title, content)
      VALUES ('delete', old.id, old.title, old.content);
    END;
  
  CREATE TRIGGER blog_au AFTER UPDATE ON blog
    BEGIN
      INSERT INTO blog_fts (blog_fts, rowid, title, content)
      VALUES ('delete', old.id, old.title, old.content);
      INSERT INTO blog_fts (rowid, title, content)
      VALUES (new.id, new.title, new.content);
    END`;

  db.exec(sql_trigger, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful added trigger for the 'blog_fts' table");
  });
};
