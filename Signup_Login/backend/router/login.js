const express=require('express');
const router=express.Router();
const User=require('../models/Users');

router.post('/signin',async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({error:'Please fill all the fields'});
    }
    try{
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(400).json({error:'Enter valid username'});
        }
        if(user.password!==password){
            return res.status(400).json({error:'Enter valid password'});
        }
        return res.status(200).json({message:'Login successful'});
    }catch(err){
        console.log(err);
        return res.status(500).json({error:'Server error'});
    }
})
module.exports=router;