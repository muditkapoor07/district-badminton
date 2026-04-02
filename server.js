require("dotenv").config();
const express       = require("express");
const session       = require("express-session");
const path          = require("path");

const authRoutes    = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret:            process.env.SESSION_SECRET,
    resave:            false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

app.use("/api/auth",     authRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`\n🏸  District Badminton running at http://localhost:${PORT}\n`)
);
