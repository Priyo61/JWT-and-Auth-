const express = require("express");
const app = express();
const port = 4040;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "abcde";
mongoose.connect(
  "mongodb+srv://priyobrata61:E8BSBCZCrWUE1zIR@cluster0.mhbfa7n.mongodb.net/todo-app"
);
const { UserModel, TodoModel } = require("./db");

app.use(express.json());
app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;

  await UserModel.create({
    username,
    password,
    name,
  });
  res.json({
    mgs: "You are sign up now",
  });
});
app.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await UserModel.findOne({
    username,
    password,
  });
  //console.log(user);

  if (user) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_SECRET
    );
    res.json({
      token: token,
    });
  } else {
    res.json({
      mgs: "Invalid",
    });
  }
});
//middleware
function auth(req, res, next) {
  const token = req.headers.token;
  const decodedData = jwt.verify(token, JWT_SECRET);
  if (decodedData) {
    req.userId = decodedData.id;
    next();
  } else {
    res.status(403).json({
      mgs: "invalid",
    });
  }
}
app.post("/todo", auth, async (req, res) => {
  const userId = req.userId;
  const description = req.body.description;

  await TodoModel.create({
    description: description,
    userid: userId,
  });
  res.json({
    userId,
  });
});
app.get("/todos", auth, async (req, res) => {
  const userId = req.userId;
  const todos = await TodoModel.find({
    userId,
  });
  res.json({
    todos,
  });
});

app.listen(port, () => {
  console.log("connceted to server");
});
