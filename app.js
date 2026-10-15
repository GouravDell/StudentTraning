
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");

const { sendError } = require("./utils/responseHandler");
const AppError = require("./utils/customError");
const { connectDB } = require("./config/dbCon");

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// Routes

app.use("/user", require("./routes/user.routes"));
app.use("/product", require("./routes/product"));
app.use("/course", require("./routes/course"));

// Routes not matched
app.all("*", (req, res, next) => {
  next(
    new AppError(
      false,
      `request url ${req.path} not found`,
      404
    )
  );
});

// Global error handler
app.use(sendError);

// Start server only after DB connection succeeds
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();