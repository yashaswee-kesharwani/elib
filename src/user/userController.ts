import { Response, Request, NextFunction } from 'express'
const createUser = async (req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:"User Created"
    });
};
export {createUser};