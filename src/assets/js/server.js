

const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "build")));

app.use(cors());
app.get("/", (req, res) => {
res.send("server working");
});

app.get("/", function(req, res) {
res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(function(req, res, next) {
//console.log(req, res, next, "req, res, nextreq, res, next")
if (
req.method === "GET" &&
req.accepts("html") &&
!req.is("json") &&
!req.path.includes(".")
) {
//res.sendFile('index.html', { root })
res.sendFile(path.join(__dirname, "build", "index.html"));
} else next();
});

app.listen(port);