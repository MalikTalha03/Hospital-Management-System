const bcrypt = require('bcryptjs');

export async function hashPassword(password) {
    console.log("password        " +  password);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}


export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
