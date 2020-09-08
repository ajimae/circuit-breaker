const express = require("express");
const app = express();
const PORT = 4000

app.get("/healthcheck", function(req, res) {
  res.status(200).json({ success: true, status: "ok", message: "backup server ok" })
})

app.listen(PORT, function() { console.log("backup server up and running"); })
