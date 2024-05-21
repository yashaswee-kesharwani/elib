import express from "express";
import { createBook, deleteBook } from "./bookController";
const bookRouter = express.Router();

bookRouter.post("/create",createBook);
bookRouter.post("/delete",deleteBook);

export default bookRouter;
