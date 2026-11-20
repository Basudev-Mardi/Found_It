const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "data", "items.json");

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Helper to read items safely
function readItems() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading data file:", err);
    return [];
  }
}

// Helper to write items safely
function writeItems(items) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing data file:", err);
    return false;
  }
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// === ROUTES ===

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "FindIt Campus Lost & Found Backend",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// GET /api/stats
app.get("/api/stats", (req, res) => {
  const items = readItems();
  const total = items.length;
  const lost = items.filter((i) => i.type === "lost").length;
  const found = items.filter((i) => i.type === "found").length;
  const recovered = items.filter((i) => i.status === "Recovered").length;
  const pendingClaims = items.filter((i) => i.status === "Claim Pending").length;
  const recoveryRate = total > 0 ? ((recovered / total) * 100).toFixed(1) + "%" : "0%";

  res.json({
    success: true,
    stats: {
      totalItems: total,
      lostItems: lost,
      foundItems: found,
      recoveredItems: recovered,
      pendingClaims,
      recoveryRate,
    },
  });
});

// GET /api/items (with filtering and search)
app.get("/api/items", (req, res) => {
  try {
    let items = readItems();
    const { type, category, campus, status, q } = req.query;

    if (type && (type === "lost" || type === "found")) {
      items = items.filter((i) => i.type === type);
    }
    if (category && category !== "All" && category !== "All Categories") {
      items = items.filter((i) => i.category.toLowerCase() === category.toLowerCase());
    }
    if (campus && campus !== "All" && campus !== "All Campuses") {
      items = items.filter((i) => i.campus.toLowerCase() === campus.toLowerCase());
    }
    if (status && status !== "All" && status !== "All Status") {
      items = items.filter((i) => i.status.toLowerCase() === status.toLowerCase());
    }
    if (q) {
      const query = q.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          i.description.toLowerCase().includes(query) ||
          i.location.toLowerCase().includes(query)
      );
    }

    res.json({ success: true, count: items.length, items });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/items/:id
app.get("/api/items/:id", (req, res) => {
  const items = readItems();
  const item = items.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: `Item with id '${req.params.id}' not found` });
  }
  res.json({ success: true, item });
});

// POST /api/items (create item with validation)
app.post("/api/items", (req, res) => {
  const { title, location, description, type, category, campus, imageUrl, reporter, contactEmail } = req.body;

  // Validation
  const errors = [];
  if (!title || typeof title !== "string" || title.trim().length < 3) {
    errors.push("Title is required and must be at least 3 characters long.");
  }
  if (!location || typeof location !== "string" || location.trim().length < 2) {
    errors.push("Specific campus location is required.");
  }
  if (!description || typeof description !== "string" || description.trim().length < 5) {
    errors.push("Description is required and must be at least 5 characters long.");
  }
  if (!type || (type !== "lost" && type !== "found")) {
    errors.push("Type must be either 'lost' or 'found'.");
  }
  if (contactEmail && !EMAIL_REGEX.test(contactEmail)) {
    errors.push("Invalid contact email format.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors, error: errors[0] });
  }

  const items = readItems();
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const newItem = {
    id: `item-${Date.now()}`,
    title: title.trim(),
    category: category || "Other",
    campus: campus || "Central Campus",
    location: location.trim(),
    date: today,
    description: description.trim(),
    status: "Available",
    type,
    imageUrl: imageUrl || "/images/bike-key.jpg",
    reporter: reporter || "Campus Community Member",
    contactEmail: contactEmail || "student@university.edu",
    isUserReported: true,
  };

  items.unshift(newItem);
  writeItems(items);

  res.status(201).json({
    success: true,
    message: `${type === "lost" ? "Lost" : "Found"} report created successfully`,
    item: newItem,
  });
});

// PATCH /api/items/:id (update status or fields)
app.patch("/api/items/:id", (req, res) => {
  const items = readItems();
  const index = items.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: `Item with id '${req.params.id}' not found` });
  }

  items[index] = { ...items[index], ...req.body };
  writeItems(items);

  res.json({ success: true, message: "Item updated successfully", item: items[index] });
});

// DELETE /api/items/:id
app.delete("/api/items/:id", (req, res) => {
  let items = readItems();
  const initialLength = items.length;
  items = items.filter((i) => i.id !== req.params.id);

  if (items.length === initialLength) {
    return res.status(404).json({ success: false, error: `Item with id '${req.params.id}' not found` });
  }

  writeItems(items);
  res.json({ success: true, message: `Item with id '${req.params.id}' deleted successfully` });
});

// GET /api/claims
app.get("/api/claims", (req, res) => {
  const items = readItems();
  const claims = items.filter((i) => i.status === "Claim Pending" || Boolean(i.claimantEmail));
  res.json({ success: true, count: claims.length, claims });
});

// POST /api/claims (submit verification claim)
app.post("/api/claims", (req, res) => {
  const { itemId, proof, email } = req.body;

  const errors = [];
  if (!itemId) errors.push("Item ID is required.");
  if (!proof || typeof proof !== "string" || proof.trim().length < 5) {
    errors.push("Identifying proof details must be at least 5 characters long.");
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push("Valid campus student email is required.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors, error: errors[0] });
  }

  const items = readItems();
  const index = items.findIndex((i) => i.id === itemId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: `Item with id '${itemId}' not found.` });
  }

  items[index].status = "Claim Pending";
  items[index].claimantProof = proof.trim();
  items[index].claimantEmail = email.trim();
  writeItems(items);

  res.json({
    success: true,
    message: "Verification claim submitted to Campus Security Desk",
    claim: {
      itemId,
      itemTitle: items[index].title,
      status: "Claim Pending",
      claimantEmail: email.trim(),
      claimantProof: proof.trim(),
      submittedAt: new Date().toISOString(),
    },
    item: items[index],
  });
});

// 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Endpoint ${req.method} ${req.url} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, error: "Internal server error", details: err.message });
});

// Start listening if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 FindIt Express Backend running on port ${PORT}`);
    console.log(`📡 Endpoints available:`);
    console.log(`   - GET  /health`);
    console.log(`   - GET  /api/stats`);
    console.log(`   - GET  /api/items (with query params)`);
    console.log(`   - POST /api/items (create report)`);
    console.log(`   - GET  /api/items/:id`);
    console.log(`   - PATCH /api/items/:id (update status)`);
    console.log(`   - DELETE /api/items/:id`);
    console.log(`   - GET  /api/claims`);
    console.log(`   - POST /api/claims (submit claim)`);
    console.log(`===============================================`);
  });
}

module.exports = app;
