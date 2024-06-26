import express, { Request, Response, NextFunction } from 'express'
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config';
import globalErrorHandler from './middlewares/globalErrorHandler';
import userRouter from './user/userRouter';
import bookRouter from './book/bookRouter';
import { query, validationResult, matchedData } from 'express-validator';



const app = express()

app.use(express.json())
app.get("/",(req,res,next)=> {
    const error = createHttpError(400, "Something went Wrong!");
    throw error;
    res.json({"message":"Welcome to elib apis"});
});

//Setting up Router
app.use("/api/users",userRouter);
app.use("/api/books",bookRouter);


// Global Error Handler
app.use(globalErrorHandler)

export default app