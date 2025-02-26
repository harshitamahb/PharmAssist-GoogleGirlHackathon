const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const app = express();

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors()); // This will allow all origins by default

// MongoDB connection string
const mongoURI =
  "mongodb+srv://harshita:GjZryDP94k8ODqoF@pharmassist.zj6za.mongodb.net/?retryWrites=true&w=majority&appName=PharmAssist";

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api", routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
