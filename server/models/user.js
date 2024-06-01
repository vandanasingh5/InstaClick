const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dyuqftfhd/image/upload/v1711865082/userPic_eqeaqi.png"
    },
    followers:[{type:ObjectId, ref:"User"}],
    following:[{type:ObjectId, ref:"User"}]
    
});

const User = mongoose.model('User', userSchema)

module.exports = User 



