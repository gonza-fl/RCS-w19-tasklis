import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

const comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
}

export { hashPassword, comparePassword };
