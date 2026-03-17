import 'dotenv/config';
import bcrypt from 'bcryptjs';
import * as jwt from 'jose';

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

const comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
}

const generateToken = async (user) => {
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const token = await new jwt.SignJWT({ email: user.email, username: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);
  return token;
}

export { hashPassword, comparePassword, generateToken };
