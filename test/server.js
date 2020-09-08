const express = require("express");
const app = express();
const PORT = 3000

app.get("/healthcheck", function(req, res) {
  res.status(200).json({ success: true, status: "ok", message: "main server ok" })
})

app.listen(PORT, function() { console.log("main server up and running"); })
