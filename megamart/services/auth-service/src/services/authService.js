const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const model = require('../models/authModel');
const { requestJson, internalHeaders } = require('../lib/http');
const { publishEvent } = require('../lib/events');

function issueAccessToken(user) {
  return jwt.sign({ sub: user.id || user.user_id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'change-me', { expiresIn: '15m', issuer: 'megamart-auth' });
}
function hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
async function issueRefresh(userId) {
  const raw = crypto.randomBytes(48).toString('base64url');
  const days = Number(process.env.REFRESH_TOKEN_DAYS || 7);
  const expiresAt = new Date(Date.now() + days * 86400000);
  await model.saveRefreshToken(userId, hashToken(raw), expiresAt);
  return raw;
}
async function register({ email, password, fullName }) {
  if (!email || !password || password.length < 8) { const e=new Error('email and password (minimum 8 characters) are required'); e.status=400; throw e; }
  if (await model.findByEmail(email)) { const e=new Error('Email is already registered'); e.status=409; throw e; }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await model.createUser(email, passwordHash);
  let profileProvisioned = false;
  try {
    await requestJson(`${process.env.USER_SERVICE_URL || 'http://localhost:3002'}/internal/users`, { method:'POST', headers:internalHeaders(), body:JSON.stringify({ authUserId:user.id, email:user.email, fullName:fullName || null }) });
    profileProvisioned = true;
  } catch (error) { console.warn('Profile provisioning deferred:', error.message); }
  await publishEvent('user.registered', { userId:user.id, email:user.email });
  return { user, profileProvisioned, accessToken:issueAccessToken(user), refreshToken:await issueRefresh(user.id) };
}
async function login({ email, password }) {
  const user = await model.findByEmail(email || '');
  if (!user || user.status !== 'active' || !(await bcrypt.compare(password || '', user.password_hash))) { const e=new Error('Invalid email or password'); e.status=401; throw e; }
  await publishEvent('user.logged_in', { userId:user.id });
  return { user:{id:user.id,email:user.email,role:user.role,status:user.status}, accessToken:issueAccessToken(user), refreshToken:await issueRefresh(user.id) };
}
async function refresh(raw) {
  if (!raw) { const e=new Error('refreshToken is required'); e.status=400; throw e; }
  const existing = await model.getRefreshToken(hashToken(raw));
  if (!existing) { const e=new Error('Refresh token is invalid, expired, or revoked'); e.status=401; throw e; }
  await model.revokeRefreshToken(hashToken(raw));
  return { accessToken:issueAccessToken(existing), refreshToken:await issueRefresh(existing.user_id) };
}
async function logout(raw) { if (raw) await model.revokeRefreshToken(hashToken(raw)); return { loggedOut:true }; }
module.exports = { register, login, refresh, logout };
