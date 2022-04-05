var express = require("express");
var app = express();
var port = 5000;
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
