const jwt = require('jsonwebtoken')
const {jwt_key} = require('../key')
const User = require('../models/user')


module.exports = (req, res, next) => {
    const {authorization} = req.headers
    //authorization
    if(!authorization){
       return res.status(401).json({error:'you must be logged in'})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token, jwt_key, (err, payload) => {
        if(err){
            return res.status(401).json({error:'you must be logged in'})
        }
        const {_id} = payload
        User.findById(_id).then(userdata =>{
            req.user = userdata
            next()
        })  
        
    })
}