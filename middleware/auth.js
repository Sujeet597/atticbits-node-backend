import jwt from "jsonwebtoken";
const SECRET_KEY = "USERAPI";

const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, SECRET_KEY);
      req.userId = user.userId;
    } else {
      return res.status(401).json({ error: "unauthorize user" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "unauthorized user" });
  }
};
export default auth;