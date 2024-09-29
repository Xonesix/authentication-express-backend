import express from "express";
import { register, login, welcome } from "./mongoose.js";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();
const port = 8080;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// MIDDLEWARE
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(limiter);
// Centralized error handling middleware
app.use((err, req, res, next) => {
  // Handle specific errors (e.g., PayloadTooLargeError)
  if (err.name === "PayloadTooLargeError") {
    return res.status(413).send({ message: "Payload Too Large" });
  }

  // Handle other types of errors
  console.error("Error:", err.message); // Log the error for debugging
  res.status(500).send({ message: "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", async (req, res) => {
  try {
    const jsonData = req.body;
    // console.log("Received JSON", jsonData);
    const user = await register(req.body);
    // console.log(user);
    res.status(200).send({ message: "Data received success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error.message);
  }
});

var session = {};

app.post("/login", async (req, res) => {
  try {
    const jsonData = req.body;
    // console.log("Received JSON", jsonData);
    const userId = await login(req.body);
    const sessionId = uuidv4();
    res.cookie("sessionToken", sessionId, {
      httpOnly: true, // Helps mitigate the risk of client-side scripts accessing the cookie
      SameSite: "None",
      Secure: false,
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
    });
    session[sessionId] = userId;

    res.status(200).send({ message: "Successfully Logged In" });
  } catch (error) {
    res.status(401).send({ message: error.message });
    console.log(error.message);
  }
});

app.get("/dashboard", async (req, res) => {
  const token = req.cookies.sessionToken;
  if (!token) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  const userId = session[token];
  if (userId) return res.status(200).send({ message: await welcome(userId) });
  else {
    return res.status(401).send({ error: "Unauthorized" });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
