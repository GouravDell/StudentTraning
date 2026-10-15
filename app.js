
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const { sendError } = require("./utils/responseHandler");
const AppError = require("./utils/customError");
const { connectDB } = require("./config/dbCon");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(
  cors({
    origin: "https://student-traning-sfn9.vercel.app",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.use("/user", require("./routes/user.routes"));
app.use("/product", require("./routes/product"));
app.use("/course", require("./routes/course"));

app.all("*", (req, res, next) => {
  next(
    new AppError(
      false,
      `Request URL ${req.originalUrl} not found`,
      404
    )
  );
});

app.use(sendError);

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();
