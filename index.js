const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("./database.sqlite");

app.use(bodyParser.json());

// Create a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  db.run(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({ id: this.lastID });
    }
  );
});

// Get all users
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

// Update a user
app.put("/users/:id", (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "User updated successfully" });
    }
  );
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM users WHERE id = ?", id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "User deleted successfully" });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
