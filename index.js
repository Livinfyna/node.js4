const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

app.post("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  const user = req.body;
  user.id = Date.now();
  users.push(user);
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.json(user);
});

app.put("/users/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  const user = { ...users[userIndex], ...req.body };
  users[userIndex] = user;
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.json(user);
});

app.delete("/users/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  const user = users[userIndex];
  users.splice(userIndex, 1);
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.json(user);
});
