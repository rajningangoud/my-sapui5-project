const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const glob = require("glob");   

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT || "3000", 10);

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../webapp")));

// ✅ Locate data file dynamically with glob
const dataFiles = glob.sync(path.join(__dirname, "*.json"));
const DATA_FILE =
  dataFiles.find((f) => f.includes("friends.json")) ||
  path.join(__dirname, "friends.json");

// ✅ Ensure file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]");
  console.log("📁 Created new friends.json file");
}

// Helper: read + write
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    return [];
  }
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ✅ GET all friends
app.get("/api/friends", (req, res) => {
  res.json(readData());
});

// ✅ POST add friend
app.post("/api/friends", (req, res) => {
  const { name, education, city } = req.body;
  if (!name || !education || !city) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newFriend = { name, education, city };
  const friends = readData();

  // prevent duplicate names
  if (friends.some(f => f.name === name)) {
    return res.status(409).json({ error: `Friend '${name}' already exists` });
  }

  friends.push(newFriend);
  writeData(friends);

  res.status(201).json(newFriend);
});

// ✅ DELETE friend by name
app.delete("/api/friends/:name", (req, res) => {
  const { name } = req.params;
  let friends = readData();

  const index = friends.findIndex((f) => f.name === name);
  if (index === -1) {
    return res.status(404).json({ error: `Friend '${name}' not found` });
  }

  const deleted = friends.splice(index, 1)[0];
  writeData(friends);
  res.json({ message: `Deleted '${deleted.name}'`, deleted });
});

// ✅ Start server
app.listen(DEFAULT_PORT, () => {
  console.log(`🚀 Server running at http://localhost:${DEFAULT_PORT}`);
  console.log(`📂 Using data file: ${DATA_FILE}`);
});
