import path from "node:path";
import express from "express";
import { createBook, deleteBook, getBook, listBook, updateBook } from "./bookController";
import multer from "multer";
import authenticate from "../middlewares/authenticate";
const bookRouter = express.Router();

const upload = multer({
	dest: path.resolve(__dirname, "../../public/data/uploads"),
	limits: { fileSize: 3e7 },
});

bookRouter.post(
	"/create",
	authenticate,
	upload.fields([
		{ name: "coverImage", maxCount: 1 },
		{ name: "file", maxCount: 1 },
	]),
	createBook
);

bookRouter.patch(
	"/:bookId",
	authenticate,
	upload.fields([
		{ name: "coverImage", maxCount: 1 },
		{ name: "file", maxCount: 1 },
	]),
	updateBook
);

bookRouter.get("/", listBook);

bookRouter.get("/:bookId", getBook);

bookRouter.delete("/:bookId", authenticate ,deleteBook);

export default bookRouter;
