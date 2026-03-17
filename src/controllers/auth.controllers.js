import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { User } from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import transporter from '../config/email.js';
import { EMAIL_TEMP } from '../config/constants.js';

const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;
  const encriptedPass = hashPassword(password);
  const user = new User({ username, email, password: encriptedPass });
  let msj = '';
  user.save()
    .then(async () => {
      const token = await generateToken(user);
      transporter.sendMail({
        from: EMAIL_TEMP.FROM,
        to: email,
        subject: EMAIL_TEMP.SUBJECT,
        text: EMAIL_TEMP.TEXT(email),
        html: EMAIL_TEMP.HTML(token),
      }).then((res) => {
        console.log(res);
        res.json({ message: 'Email sent successfully' })
      })
        .catch((error) => msj = 'Error sending email: ' + error)

      res.json({ message: 'User registered successfully. ' + msj })
    })
    .catch((error) => res.status(500).json({ message: 'Error registering user', error: error.message }))
});

const confirmEmail = catchAsync(async (req, res) => {
  const { user } = req;
  user.isEmailConfirmed = true;
  user.save()
    .then(() => res.json({ message: 'Email confirmed successfully' }))
    .catch((error) => res.status(500).json({ message: 'Error confirming email', error }))
});

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const isPasswordValid = comparePassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  const token = generateToken(user);
  res.json({ message: 'User logged in successfully', token });
};

export { login, register, confirmEmail };
