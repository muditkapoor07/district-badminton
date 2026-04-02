const express = require("express");
const bcrypt  = require("bcryptjs");
const db      = require("../db");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password)
    return res.status(400).json({ error: "Name, email, and password are required." });

  if (password.length < 8)
    return res.status(400).json({ error: "Password must be at least 8 characters." });

  try {
    const hash = await bcrypt.hash(password, 12);
    const result = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name.trim(), email.toLowerCase().trim(), hash]
    );
    const user = result.rows[0];
    req.session.userId = user.id;
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ error: "An account with that email already exists." });
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password)
    return res.status(400).json({ error: "Email and password are required." });

  try {
    const result = await db.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: "Invalid email or password." });

    req.session.userId = user.id;
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

// GET /api/auth/me  — returns the currently logged-in user (or null)
router.get("/me", async (req, res) => {
  if (!req.session.userId) return res.json({ user: null });

  try {
    const result = await db.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.session.userId]
    );
    res.json({ user: result.rows[0] ?? null });
  } catch (err) {
    console.error("Session check error:", err);
    res.json({ user: null });
  }
});

module.exports = router;
