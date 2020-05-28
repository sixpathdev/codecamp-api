const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json())
app.use("/api/users", require("./routes/users"))
app.use("/api/projects", require("./routes/projects"))
app.use("/api/tasks", require("./routes/tasks"))

app.get("/", (req, res) => {
  res.status(200).json({ message: "use /api as prefix for endpoints" });
});

mongoose.connect(
  "mongodb://rootuser:rootuser1@ds029426.mlab.com:29426/scrapemyblog",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, ()=> console.log("Mongoose connected")
);

app.listen(3000, () => console.log("app running on port 3000"));
