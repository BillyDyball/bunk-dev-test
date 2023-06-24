const express = require("express");
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

// API root
app.use("/api", payoutRoute);

// PORT
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("Listening on port " + port);
});

// Base Route
app.get("/", (req, res) => {
    res.send("invaild endpoint");
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    res.status(err.statusCode).send(err.message);
});
