import type { NextFunction, Request } from "express"
import jwt from "jsonwebtoken"

export const authMiddleware(req: Request,res: Response, next: NextFunction){
    const header = req.body.authorization!;
    try{
        let data = jwt.verify(header, process.env.JWT_SECRET);
        req.userId = data.sub as string;
        next();
    }catch(err){
        res.status(403).send(err)
    }
}