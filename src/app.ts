import express, { Request, Response, NextFunction } from 'express'
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config';
import globalErrorHandler from './middlewares/globalErrorHandler';
import userRouter from './user/userRouter';

const app = express()
app.get("/",(req,res,next)=> {
    const error = createHttpError(400, "Something went Wrong!");
    throw error;
    res.json({"message":"Welcome to elib apis"});
});

//Setting up Router
app.use("/api/users",userRouter);

// Global Error Handler
app.use(globalErrorHandler)

export default app