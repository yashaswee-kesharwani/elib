import express, { Request, Response, NextFunction } from 'express'
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config';
import globalErrorHandler from './middlewares/globalerrorhandler';

const app = express()
app.get("/",(req,res,next)=> {
    const error = createHttpError(400, "Something went Wrong!");
    throw error;
    res.json({"message":"Welcome to elib apis"});
});

// Global Error Handler
app.use(globalErrorHandler)


export default app