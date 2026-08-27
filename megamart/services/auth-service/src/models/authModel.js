const { query } = require('../config/database');
async function findByEmail(email) { return (await query('SELECT * FROM auth_users WHERE lower(email)=lower($1)', [email])).rows[0]; }
async function findById(id) { return (await query('SELECT id,email,role,status,created_at,updated_at FROM auth_users WHERE id=$1', [id])).rows[0]; }
async function createUser(email, passwordHash, role='customer') { return (await query('INSERT INTO auth_users(email,password_hash,role) VALUES($1,$2,$3) RETURNING id,email,role,status,created_at', [email,passwordHash,role])).rows[0]; }
async function saveRefreshToken(userId, tokenHash, expiresAt) { await query('INSERT INTO refresh_tokens(user_id,token_hash,expires_at) VALUES($1,$2,$3)', [userId,tokenHash,expiresAt]); }
async function getRefreshToken(tokenHash) { return (await query(`SELECT rt.*, au.email, au.role, au.status FROM refresh_tokens rt JOIN auth_users au ON au.id=rt.user_id WHERE rt.token_hash=$1 AND rt.revoked_at IS NULL AND rt.expires_at>now()`, [tokenHash])).rows[0]; }
async function revokeRefreshToken(tokenHash) { await query('UPDATE refresh_tokens SET revoked_at=now() WHERE token_hash=$1 AND revoked_at IS NULL', [tokenHash]); }
module.exports = { findByEmail, findById, createUser, saveRefreshToken, getRefreshToken, revokeRefreshToken };
