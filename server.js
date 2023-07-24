var express = require("express");
var fs = require("fs");
var path = require("path");

// Start the server
var app = express();
app.listen(5000, console.log("Server up and running"));
// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/blacklist", (req, res) => {
  var ip = req.body.ip;
  fs.readFile(
    path.join(__dirname, "blacklist.txt"),
    {
      encoding: "utf-8",
    },
    function (err, data) {
      if (err) {
        res.status(400).send("Error happened");
      }
      var blacklist = [...JSON.parse(data), ip];
      fs.writeFile(
        path.join(__dirname, "blacklist.txt"),
        JSON.stringify(blacklist),
        function (err, data) {
          if (err) {
            res.status(400).send("Error happened");
          } else {
            res.status(200).send(null);
          }
        }
      );
    }
  );
});

app.get("/blacklist", (req, res) => {
  fs.readFile(
    path.join(__dirname, "blacklist.txt"),
    { encoding: "utf-8" },
    function (err, data) {
      if (err) {
        res.status(400).json(null);
      }
      res.status(200).json(data);
    }
  );
});
