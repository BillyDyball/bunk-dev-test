const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const payoutRoute = require("./routes/payout.routes");

const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(cors());

// Static directory path
app.use(
    express.static(path.join(__dirname, "dist/bunk-dev-test"))
);

// API root
app.use("/api", payoutRoute);

// PORT
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("Listening on port " + port);
});

// 404 Handler
app.use((req, res, next) => {
    next(createError(404));
});

// Base Route
app.get("/", (req, res) => {
    res.send("invaild endpoint");
});

app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "dist/bunk-dev-test/index.html")
    );
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    res.status(err.statusCode).send(err.message);
});
