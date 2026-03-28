const { execute, runSQL, queryOne } = require("./db");

// ─── Seed Script ─────────────────────────────────────────────────
// Populates the database with sample data for development/demo

function seed() {
  // Check if data already exists - don't seed if it does (preserves user data)
  const existingUser = queryOne("SELECT id FROM users LIMIT 1");
  if (existingUser) {
    console.log(
      "✅ Database already seeded, skipping seed to preserve user data",
    );
    return;
  }

  console.log("📦 Database empty, seeding with sample data...");

  // Clear existing data (order matters due to foreign keys)
  runSQL(`
    DELETE FROM bookings;
    DELETE FROM availability;
    DELETE FROM event_types;
    DELETE FROM users;
  `);

  // ── Insert default user ──
  const userResult = execute(
    `INSERT INTO users (name, email, timezone) VALUES (?, ?, ?)`,
    ["John Doe", "john@example.com", "Asia/Kolkata"],
  );
  const userId = userResult.lastId;

  // ── Insert sample event types ──
  const event1Result = execute(
    `INSERT INTO event_types (user_id, title, description, duration, slug, location)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      "15 Minute Meeting",
      "A quick 15-minute introductory call to discuss your needs.",
      15,
      "15-min-meeting",
      "Google Meet",
    ],
  );

  const event2Result = execute(
    `INSERT INTO event_types (user_id, title, description, duration, slug, location)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      "30 Minute Meeting",
      "A standard 30-minute meeting for detailed discussions.",
      30,
      "30-min-meeting",
      "Google Meet",
    ],
  );

  const event3Result = execute(
    `INSERT INTO event_types (user_id, title, description, duration, slug, location)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      "60 Minute Consultation",
      "An in-depth 60-minute consultation session for complex topics.",
      60,
      "60-min-consultation",
      "Zoom",
    ],
  );

  // ── Insert availability (Mon-Fri, 9 AM to 5 PM) ──
  // day_of_week: 0=Sunday, 1=Monday, ..., 6=Saturday
  for (let day = 1; day <= 5; day++) {
    execute(
      `INSERT INTO availability (user_id, day_of_week, start_time, end_time, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, day, "09:00", "17:00", 1],
    );
  }
  // Weekend - inactive
  execute(
    `INSERT INTO availability (user_id, day_of_week, start_time, end_time, is_active)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, 0, "09:00", "17:00", 0],
  ); // Sunday
  execute(
    `INSERT INTO availability (user_id, day_of_week, start_time, end_time, is_active)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, 6, "09:00", "17:00", 0],
  ); // Saturday

  // ── Insert sample bookings ──
  // A few upcoming bookings
  execute(
    `INSERT INTO bookings (event_type_id, booker_name, booker_email, date, start_time, end_time, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event2Result.lastId,
      "Alice Smith",
      "alice@example.com",
      "2026-03-30",
      "10:00",
      "10:30",
      "confirmed",
      "Want to discuss project timeline",
    ],
  );

  execute(
    `INSERT INTO bookings (event_type_id, booker_name, booker_email, date, start_time, end_time, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event1Result.lastId,
      "Bob Johnson",
      "bob@example.com",
      "2026-03-31",
      "14:00",
      "14:15",
      "confirmed",
      null,
    ],
  );

  execute(
    `INSERT INTO bookings (event_type_id, booker_name, booker_email, date, start_time, end_time, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event3Result.lastId,
      "Carol Williams",
      "carol@example.com",
      "2026-04-01",
      "11:00",
      "12:00",
      "confirmed",
      "Deep dive into architecture",
    ],
  );

  // A past booking
  execute(
    `INSERT INTO bookings (event_type_id, booker_name, booker_email, date, start_time, end_time, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event2Result.lastId,
      "Dave Brown",
      "dave@example.com",
      "2026-03-25",
      "09:00",
      "09:30",
      "confirmed",
      null,
    ],
  );

  // A cancelled booking
  execute(
    `INSERT INTO bookings (event_type_id, booker_name, booker_email, date, start_time, end_time, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event1Result.lastId,
      "Eve Davis",
      "eve@example.com",
      "2026-03-26",
      "15:00",
      "15:15",
      "cancelled",
      "Had a conflict",
    ],
  );

  console.log("✅ Database seeded successfully!");
  console.log(`   - 1 user created`);
  console.log(`   - 3 event types created`);
  console.log(`   - 7 availability slots created`);
  console.log(`   - 5 bookings created`);
}

module.exports = { seed };
