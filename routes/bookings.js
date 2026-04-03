const express = require("express");
const db      = require("../db");
const { sendBookingConfirmation } = require("../utils/email");

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.userId)
    return res.status(401).json({ error: "You must be logged in to do that." });
  next();
}

// GET /api/bookings?date=YYYY-MM-DD
// All bookings for a date (public — so everyone sees which slots are taken)
router.get("/", async (req, res) => {
  const { date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date))
    return res.status(400).json({ error: "date query param is required (YYYY-MM-DD)." });

  try {
    const result = await db.query(
      `SELECT b.id, b.user_id, b.court_id, b.slot_id, b.slot_time, b.court_name,
              u.name AS user_name
       FROM   bookings b
       JOIN   users    u ON b.user_id = u.id
       WHERE  b.booking_date = $1`,
      [date]
    );
    res.json({ bookings: result.rows });
  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// GET /api/bookings/mine — all bookings for the logged-in user
// Must be defined BEFORE /:id to avoid "mine" being treated as an id
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, court_id, court_name, slot_id, slot_time,
              booking_date, created_at
       FROM   bookings
       WHERE  user_id = $1
       ORDER  BY booking_date ASC, slot_time ASC`,
      [req.session.userId]
    );
    res.json({ bookings: result.rows });
  } catch (err) {
    console.error("Fetch my bookings error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// POST /api/bookings
router.post("/", requireAuth, async (req, res) => {
  const { courtId, courtName, slotId, slotTime, date } = req.body;

  if (!courtId || !courtName || !slotId || !slotTime || !date)
    return res.status(400).json({ error: "Missing required fields." });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return res.status(400).json({ error: "Invalid date format." });

  try {
    const result = await db.query(
      `INSERT INTO bookings (user_id, court_id, court_name, slot_id, slot_time, booking_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [req.session.userId, courtId, courtName, slotId, slotTime, date]
    );

    // Send email confirmation (non-blocking — don't fail booking if email fails)
    db.query("SELECT name, email FROM users WHERE id = $1", [req.session.userId])
      .then(({ rows }) => {
        if (rows[0]) {
          sendBookingConfirmation(rows[0].email, rows[0].name, {
            courtName, slotTime, date,
          }).catch(console.error);
        }
      })
      .catch(console.error);

    res.status(201).json({ bookingId: result.rows[0].id });
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ error: "That slot has already been booked." });
    console.error("Create booking error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// DELETE /api/bookings/:id — only the owner can cancel
router.delete("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id))
    return res.status(400).json({ error: "Invalid booking ID." });

  try {
    const result = await db.query(
      "DELETE FROM bookings WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.session.userId]
    );
    if (!result.rowCount)
      return res.status(404).json({ error: "Booking not found or you don't own it." });
    res.json({ ok: true });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
