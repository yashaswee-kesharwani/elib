import path from "node:path";
import express from "express";
import { createBook, deleteBook } from "./bookController";
import multer from "multer";
const bookRouter = express.Router();

const upload = multer({
	dest: path.resolve(__dirname, "../../public/data/uploads"),
	limits: { fileSize: 3e7 },
});

bookRouter.post(
	"/create",
	upload.fields([
		{ name: "coverImage", maxCount: 1 },
		{ name: "file", maxCount: 1 },
	]),
	createBook
);
bookRouter.post("/delete", deleteBook);

export default bookRouter;
