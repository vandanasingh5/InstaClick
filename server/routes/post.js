const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const User = require("../models/user")
const requireLogin = require('../middlewear/requireLogin')
const Post = mongoose.model("Post")

//all post router

router.get('/allPost',requireLogin, (req,res) => {
   Post.find()
   .populate("postedBy","_id name")
   .then(posts => {
    res.json(posts)
   }).catch(err => {
    console.log(err);
   })
})

// create post router
router.post('/createPost',requireLogin,(req,res) => {
    const {title, body, pic} = req.body
    if(!title || !body || !pic){
       return res.status(422).json({error:"Please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user,
    })
    post.save().then(result => {
        res.json({post:result})
    })
    .catch(err => {
        console.log(err);
    })
})


//  My post route

router.get('/myPost',requireLogin, (req,res) => {
      Post.find({postedBy:req.user.id})
      .populate("postedBy","_id name")
      .then(mypost => {
        res.json({mypost})
      })
      .catch(err => {
        console.log(err);
      })
});

router.get('/',requireLogin, (req,res) => {
  Post.find({postedBy:{$in:req.user.following}})
  
  .populate("postedBy","_id name")
  .populate("comments.postedBy","_id name")
  .then(mypost => {
    res.json({mypost})
  })
  .catch(err => {
    console.log(err);
  })
})

router.put('/like', requireLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      await post.save();
    }
    res.json(post);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});

router.put('/unlike', requireLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    if (post.likes.includes(req.user._id)) {
      post.likes.pull(req.user._id);
      await post.save();
    }
    res.json(post);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});

router.put('/comment', requireLogin, async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id
    };
    const updatedPost = await Post.findByIdAndUpdate(req.body.postId, {
      $push: { comments: comment }
    }, {
      new: true
    })
    .populate("comments.postedBy","_id name")
    res.json(updatedPost);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});


router.delete('/deletepost/:postId', requireLogin, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId }).populate("postedBy", "_id");
    console.log("Post found:", post);
    if (!post) {
      return res.status(422).json({ error: "Post not found" });
    }
    console.log("Posted by:", post.postedBy);
    console.log("Request user:", req.user);
    if (post.postedBy._id.toString() !== req.user._id.toString()) {
      
      return res.status(401).json({ error: "Unauthorized" });
    }
    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});







module.exports = router