import jwt, {JwtPayload} from "jsonwebtoken";
import { NextApiRequest } from "next";

const Auth = async (req: Request) => {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return false;
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY ?? 'default_secret_dumbScret') as JwtPayload;
      if(decoded) return decoded?.username;
    } catch (error) {
      return false
    }
  }

export default Auth