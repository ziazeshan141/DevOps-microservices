const auth = require('../services/authService');
const model = require('../models/authModel');
async function register(req,res,next){try{res.status(201).json(await auth.register(req.body));}catch(e){next(e)}}
async function login(req,res,next){try{res.json(await auth.login(req.body));}catch(e){next(e)}}
async function me(req,res,next){try{const user=await model.findById(req.user.sub); if(!user)return res.status(404).json({error:'NOT_FOUND'}); res.json(user);}catch(e){next(e)}}
async function refresh(req,res,next){try{res.json(await auth.refresh(req.body.refreshToken));}catch(e){next(e)}}
async function logout(req,res,next){try{res.json(await auth.logout(req.body.refreshToken));}catch(e){next(e)}}
module.exports={register,login,me,refresh,logout};
