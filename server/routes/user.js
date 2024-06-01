const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const User = require("../models/user")
const requireLogin = require('../middlewear/requireLogin')
const Post = mongoose.model("Post")


router.get('/user/:id', async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id }).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const posts = await Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name");
  
      res.json({ user, posts });
    } catch (error) {
      console.log(error);
      return res.status(422).json({ error: "Something went wrong" });
    }
  });



  router.put('/follow', requireLogin, async (req, res) => {
    try {
        const followedUser = await User.findByIdAndUpdate(
            req.body.followId,
            { $push: { followers: req.user._id } },
            { new: true }
        );
        const followerUser = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        ).select("-password");
        res.json(followerUser);
    } catch (error) {
        return res.status(422).json({ error: error.message });
    }
});

router.put('/unfollow', requireLogin, async (req, res) => {
    try {
        const unfollowedUser = await User.findByIdAndUpdate(
            req.body.unfollowId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );
        const unfollowerUser = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.unfollowId } },
            { new: true }
        ).select("-password");
        res.json(unfollowerUser);
    } catch (error) {
        return res.status(422).json({ error: error.message });
    }
});

  
module.exports = router