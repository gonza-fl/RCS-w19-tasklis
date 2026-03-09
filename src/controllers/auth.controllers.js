import { hashPassword, comparePassword } from '../utils/auth.js';
import { User } from '../models/User.js';
import * as jose from 'jose';
import { catchAsync } from '../utils/catchAsync.js';

const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;
  const encriptedPass = hashPassword(password);
  const user = new User({ username, email, password: encriptedPass });
  user.save()
    .then(() => res.json({ message: 'User registered successfully' }))
    .catch((error) => res.status(500).json({ message: 'Error registering user', error }))
});

const login = async (req, res) => {
  const { email, password } = req.body;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const isPasswordValid = comparePassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const token = await new jose.SignJWT({
    username: user.username,
    email: user.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1m')
    .sign(secret)

  res.json({ message: 'User logged in successfully', token });
};

export { login, register };
