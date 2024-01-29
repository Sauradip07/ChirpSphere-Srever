import jwt from "jsonwebtoken";
import { prismaClient } from "../../clients/db";
import { User } from "@prisma/client";

const JWT_SECRET = "$uper@1234"

class JWTService {
    public static generateTokenForUser(user: User) {
        //const user = await prismaClient.user.findUnique({ where: { id: userId } });
        const payload = {
            id :user?.id,
            email: user?.email
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
        return token;
    }
}

export default JWTService;