const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

// Define the port on which the server will run
const port = process.env.PORT || 3000;

// Connect to the database
connectDB().catch((err) => {
  console.error("Database connection error:", err);
  process.exit(1); // Exit the process if the connection fails
});

// Create the Express application
const app = express();

// CORS configuration
let corsOptions = {
  origin: [], // Fill in allowed origins in production
  optionsSuccessStatus: 200,
};

if (process.env.NODE_ENV === "development") {
  // Allow all origins in development
  corsOptions = {
    origin: true, // Reflect request origin
    optionsSuccessStatus: 200,
  };
}

// Enable cross-origin resource sharing
app.use(cors(corsOptions));

// Parse incoming JSON data
// app.use(express.json());
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
    limit: "50mb",
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parse incoming URL-encoded data
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const assessmentRoutes = require('./routes/assessmentRoutes');
const leadRoutes = require('./routes/leadRoutes');

// Define routes for the API
app.use("/api/assessments", assessmentRoutes);
app.use('/api/leads', leadRoutes);

const server = http.createServer(app);

// Error handling for server startup
server.listen(port, (err) => {
  if (err) {
    console.error("Server startup error:", err);
    return;
  }
  console.log(`Server started on port ${port}`);
});
