import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 5000;
const subscriptions = new Set();

app.use(cors());
app.use(express.json());

const subscriptionSchema = new mongoose.Schema(
  { email: { type: String, required: true, unique: true, lowercase: true } },
  { timestamps: true }
);
const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "jadoo-api" }));

app.post("/api/subscribe", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  try {
    if (process.env.MONGODB_URI) {
      await Subscription.create({ email });
    } else {
      subscriptions.add(email);
    }
    return res.status(201).json({ message: "You're on the list! Watch your inbox for new journeys." });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "That email is already subscribed." });
    console.error("Subscription error:", error);
    return res.status(500).json({ message: "We couldn't save your subscription. Please try again." });
  }
});

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error.message));
}

app.listen(port, () => console.log(`Jadoo API listening on http://localhost:${port}`));
