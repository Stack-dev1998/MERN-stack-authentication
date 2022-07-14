const jwt = require("jsonwebtoken");
const sendLink = (user,baseUrl) => {
  const secret = process.env.secret + user.password;
  const payload = {
    id: user.id,
    email: user.email,
  };
  const token = jwt.sign(payload, secret, {
    expiresIn: "10m",
  });
  return `${baseUrl}/${user.id}/${token}`;
};
module.exports = sendLink;
