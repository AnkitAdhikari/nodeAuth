const express = require("express");
const { users } = require("./model/");
const bcrypt = require("bcryptjs");
const app = express();
// requiring database file
require("./model/");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// nodejs lai ejs use gar vaneko here
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home.ejs");
});
// register form

app.get("/register", (req, res) => {
  res.render("register");
});

// POST API (register)
app.post("/createUser", async (req, res) => {
  // const username = req.body.username;
  const userFound = await users.findAll({
    where: {
      email: req.body.email,
    },
  });
  if (userFound.length === 0) {
    await users.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    res.redirect("/login");
  } else {
    res.send("email already registered");
  }
  // finally create vayepaxi
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  const { username, email, password } = req.body;

  console.log(username, email, password);

  const userFound = await users.findAll({
    where: {
      email,
    },
  });

  if (userFound.length === 0) {
    res.send("Email not regitsters");
  } else {
    const databasePassword = userFound[0].password;
    const isCorrect = bcrypt.compareSync(password, databasePassword);

    if (isCorrect) {
      res.send("Login sucessful");
    } else {
      res.send("Invalid Email or Password");
    }
  }
});

// listening the server
app.listen(3000, () => {
  console.log("Server has started at port 3000");
});
