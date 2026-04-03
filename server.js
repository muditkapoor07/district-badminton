require("dotenv").config();
const express       = require("express");
const session       = require("express-session");
const path          = require("path");

const authRoutes    = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");

const app = express();

// Required for secure cookies to work behind Render's reverse proxy
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret:            process.env.SESSION_SECRET,
    resave:            false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure:   true,   // Render always serves over HTTPS
      sameSite: "lax",
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
