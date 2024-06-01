const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_key } = require("../key");
const requireLogin = require('../middlewear/requireLogin');




// signUp function

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  User.findOne({ email: email })
    .then((saveUser) => {
      if (saveUser) {
        return res
          .status(422)
          .json({ error: "user allready exist with that email" });
      }
      bycrpt.hash(password, 12).then((hashpassword) => {
        const user = new User({
          name,
          password: hashpassword,
          email,
          pic
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "Saved successfuly" });
          })
          .catch((err) => res.json(err));
      });
    })
    .catch((err) => res.json(err));
});

// signIn function

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  User.findOne({ email:email }).then((saveUser) => {
    if (!saveUser) {
      return res.status(422).json({ error: "Invalid Email or password" });
    }
    bycrpt.compare(password, saveUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({message:'successfully signed in'})
          const token = jwt.sign({_id:saveUser._id}, jwt_key);
          const {_id,name,email,followers, following, pic} = saveUser
          res.json({ token,user:{_id,name,email,followers,following,pic} });
        } else {
          return res.status(422).json({ error: "Invalid Email or password" });
        }
      })
      .catch((err) => console.log(err));
  });
});

module.exports = router;
