const express = require("express");
const cors = require("cors");
const { getData, createData, updateData, deleteData } = require("./controller");

const app = express();
const port = 8080;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// routes
app
  .route("/data")
  .get(getData)
  .post(createData)
  .put(updateData)
  .delete(deleteData);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
