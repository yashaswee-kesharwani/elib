import path from "node:path";
import express, { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
	const { title, genre } = req.body;
	const files = req.files as { [filename: string]: Express.Multer.File[] }; // Remember this line
	const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
	const fileName = files.coverImage[0].filename;
	const filePath = path.resolve(
		__dirname,
		"../../public/data/uploads",
		fileName
	);
	const uploadResult = await cloudinary.uploader.upload(filePath, {
		filename_override: fileName,
		folder: "book-covers",
		format: coverImageMimeType,
	});

	const bookMimeType = files.file[0].mimetype.split("/").at(-1);
	const bookName = files.file[0].filename;
	const bookPath = path.resolve(
		__dirname,
		"../../public/data/uploads",
		bookName
	);
	const bookUploadResult = await cloudinary.uploader.upload(bookPath, {
		resource_type: "raw",
		filename_override: fileName,
		folder: "book-pdfs",
		format: bookMimeType,
	});
	// @ts-ignore

		const _req = req as AuthRequest;
	const newBook = await bookModel.create({
		title: title,
		genre: genre,
		author: _req.userId,
		coverImage: uploadResult.secure_url,
		file: bookUploadResult.secure_url,
	});

	await fs.promises.unlink(filePath);
	await fs.promises.unlink(bookPath);

	res.status(201).json({
		id: newBook._id,
	});
};
const getBook = async (req: Request, res: Response, next: NextFunction) => {
	res.json({});
};
const listBook = async (req: Request, res: Response, next: NextFunction) => {
	res.json({});
};
const updateBookAuthor = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.json({});
};
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
	res.json({});
};

export { createBook, getBook, listBook, updateBookAuthor, deleteBook };
