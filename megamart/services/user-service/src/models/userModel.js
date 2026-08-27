const {query}=require('../config/database');
async function create({authUserId,email,fullName}){return (await query('INSERT INTO user_profiles(auth_user_id,email,full_name) VALUES($1,$2,$3) ON CONFLICT(auth_user_id) DO UPDATE SET email=excluded.email RETURNING *',[authUserId,email,fullName])).rows[0]}
async function byAuthId(id){return (await query('SELECT * FROM user_profiles WHERE auth_user_id=$1',[id])).rows[0]}
async function update(id,p){return (await query(`UPDATE user_profiles SET full_name=COALESCE($2,full_name),phone=COALESCE($3,phone),avatar_url=COALESCE($4,avatar_url),preferences=COALESCE($5,preferences),updated_at=now() WHERE auth_user_id=$1 RETURNING *`,[id,p.fullName,p.phone,p.avatarUrl,p.preferences])).rows[0]}
async function remove(id){return (await query('DELETE FROM user_profiles WHERE auth_user_id=$1 RETURNING auth_user_id',[id])).rows[0]}
module.exports={create,byAuthId,update,remove};
