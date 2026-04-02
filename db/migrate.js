require("dotenv").config();
const fs = require("fs");
const db = require("./index");

async function migrate() {
  const sql = fs.readFileSync(__dirname + "/schema.sql", "utf8");
  await db.query(sql);
  console.log("✓ Schema applied successfully");
  await db.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
