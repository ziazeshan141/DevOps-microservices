const s=require('../services/userService');
function allowed(req,id){return req.user.sub===id||req.user.role==='admin'}
async function internalCreate(req,res,next){try{res.status(201).json(await s.create(req.body));}catch(e){next(e)}}
async function get(req,res,next){try{if(!allowed(req,req.params.id))return res.status(403).json({error:'FORBIDDEN'});const x=await s.get(req.params.id); if(!x)return res.status(404).json({error:'NOT_FOUND'});res.json(x)}catch(e){next(e)}}
async function update(req,res,next){try{if(!allowed(req,req.params.id))return res.status(403).json({error:'FORBIDDEN'});res.json(await s.update(req.params.id,req.body))}catch(e){next(e)}}
async function remove(req,res,next){try{if(!allowed(req,req.params.id))return res.status(403).json({error:'FORBIDDEN'});await s.remove(req.params.id);res.status(204).end()}catch(e){next(e)}}
module.exports={internalCreate,get,update,remove};
