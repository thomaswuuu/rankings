const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const connectDB = require("./config/db");
const indexRouter = require("./routes/index");
const kkboxRouter = require("./routes/kkbox");
const auth = require("./routes/auth");
const admin = require("./routes/admin");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "frontend")));

// Connect to database
connectDB();

// Route setting
app.use("/api/", indexRouter);
app.use("/api/kkbox/charts", kkboxRouter);
// admin route
app.use("/auth", auth);
app.use("/admin", auth.authCheck, admin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
