const express = require("express")
, path = require("path")
, mongoose = require("mongoose")
, bodyParser = require("body-parser")
, promise = require("bluebird")
, cors = require('cors')

, auth = require("./routes/auth")
, users = require("./routes/users")
, lists = require("./routes/lists")
, todo = require("./routes/todo")
, pass = require("./routes/password")
, time = require("./routes/timer")
, note = require("./routes/note")
, tags = require("./routes/tags")
, setting = require("./routes/setting")
, overview = require("./routes/overview");

const beta = require("./routes/beta");

mongoose.Promise = promise;
mongoose.connect("mongodb://localhost/mypanel");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/list", lists);
app.use("/api/todo", todo);
app.use("/api/password", pass);
app.use("/api/time", time);
app.use("/api/note", note);
app.use("/api/tags",tags);
app.use("/api/overview",overview);
app.use("/api/setting",setting);
app.use("/api/beta",beta);

app.get("/*",(req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"));
});

app.listen(3001, () => console.log("Running on port 3001..."));