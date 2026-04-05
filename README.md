# 🏸 District Badminton — Court Booking App

A simple web app that lets players browse, book, and manage badminton court slots online — no phone calls, no back-and-forth. Just pick a date, choose a slot, and you're good to go.

---

## 🧠 What This Project Does (Plain English)

This project is a **badminton court booking system** for District Badminton. It lets players:

- Sign up and log in to their personal account
- Browse available courts and time slots for any date
- Book a slot in seconds — and get a confirmation email automatically
- View and cancel their upcoming bookings anytime

Think of it as a tool that:

- Takes in your **preferred date, court, and time slot**
- Checks if that slot is **still available** in real time
- Locks it in for you and **emails you a confirmation**

---

## ✨ Key Features

- 🔹 **User Accounts:** Register and log in securely. Passwords are encrypted — never stored in plain text.
- 🔹 **Live Slot Availability:** When you pick a date, you instantly see which slots are already taken and which are free.
- 🔹 **One-Click Booking:** Select your court and time, confirm the details, and your slot is reserved.
- 🔹 **Booking Confirmation Page:** Before you finalise, you see a summary — venue, date, time slot, and price — so there are no surprises.
- 🔹 **Email Confirmation:** Once booked, you automatically receive a confirmation email with all your booking details.
- 🔹 **My Bookings Dashboard:** View all your upcoming bookings in one place and cancel any of them if your plans change.
- 🔹 **Double-Booking Prevention:** The system ensures no two people can book the same court slot on the same day.

---

## ⚙️ How It Works

1. You **register** with your name, email, and password
2. You **pick a date** and browse courts — taken slots are shown so you know what's free
3. You **select a court and time slot** — a confirmation summary appears showing the full details
4. You **confirm the booking** — it's saved to the database and locked against double-booking
5. You **receive an email** with your booking details
6. You can **view or cancel** your bookings any time from your dashboard

---

## 🚀 How to Use It

### Step 1: Setup

Clone the repository:

```bash
git clone https://github.com/muditkapoor07/district-badminton.git
cd district-badminton
```

Install dependencies:

```bash
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=any_long_random_string
PORT=3000
```

> You can get a free PostgreSQL database at [neon.tech](https://neon.tech).

### Step 3: Set Up the Database

Run the migration to create the required tables:

```bash
npm run migrate
```

### Step 4: Start the App

```bash
npm start
```

Then open your browser and go to: `http://localhost:3000`

---

## 🧩 Example Usage

1. Open the app in your browser
2. Click **Register** → enter your name, email, and password
3. On the home screen, pick a date (e.g. `12 April 2026`)
4. You'll see available courts and time slots for that day
5. Click a free slot → a **confirmation popup** shows:
   - Venue: Court 1 – Main Hall
   - Date: 12 April 2026
   - Time: 7:00 AM – 8:00 AM
   - Price: ₹200
6. Click **Confirm Booking** → slot is booked instantly
7. Check your email — a confirmation lands in your inbox
8. Click **My Bookings** in the menu to see all your reservations

---

## 🛠️ Configuration

Environment variables in your `.env` file:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (from Neon, Supabase, etc.) |
| `SESSION_SECRET` | A long random string used to secure login sessions |
| `PORT` | Port the server runs on (defaults to `3000`) |

---

## 📂 Project Structure

```
district-badminton/
 ├── public/
 │   └── index.html       # The entire front-end (HTML, CSS, JavaScript)
 ├── routes/
 │   ├── auth.js          # Register, login, logout, session check
 │   └── bookings.js      # Create, view, and cancel bookings
 ├── db/
 │   ├── index.js         # Database connection
 │   ├── migrate.js       # Creates database tables on first run
 │   └── schema.sql       # Table definitions (users & bookings)
 ├── utils/
 │   └── email.js         # Sends booking confirmation emails
 ├── server.js            # Main app entry point
 ├── .env                 # Your secret config (never shared)
 ├── .gitignore           # Keeps secrets out of GitHub
 └── package.json         # Project info and dependencies
```

---

## 💡 Who Is This For?

- **Players** who want to quickly reserve a court without calling anyone
- **Club admins** who want to reduce manual booking management
- **Developers** looking for a simple full-stack Node.js + PostgreSQL project to learn from

---

## ⚠️ Notes

- Make sure **Node.js (v18+)** is installed on your machine
- A **PostgreSQL database** is required — the app won't start without one
- The `.env` file must never be committed to GitHub (it contains your database password)
- Email confirmations require a valid email provider configured in `utils/email.js`

---

## 📌 Summary

District Badminton helps players **book courts online in seconds** by:

- Showing real-time slot availability
- Preventing double-bookings automatically
- Sending instant email confirmations
- Giving players full control over their reservations
