
import jwt from "jsonwebtoken";

export const getEmail = (request) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    return decodedToken;
  } catch (error) {
    console.log(error.message);
    
  }
};
