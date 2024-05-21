import path from "node:path";
import express, { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";
import { error } from "node:console";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { title, genre } = req.body;
		const files = req.files as { [filename: string]: Express.Multer.File[] }; // Remember this line
		const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
		const fileName = files.coverImage[0].filename;
		const filePath = path.resolve(
			__dirname,
			"../../public/data/uploads/",
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
			"../../public/data/uploads/",
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
	} catch (err) {
		res.json({ error: err });
	}
};
const getBook = async (req: Request, res: Response, next: NextFunction) => {
	const bookId = req.params.bookId;
	try {
		const book = await bookModel.findOne({_id:bookId});
		if(!book) {
			return next(createHttpError(404,"Book Not Found"));
		}
		res.json(book);
	} catch (err) {
		return next(createHttpError(500, { error: err }));
	}
};
const listBook = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const book = await bookModel.find();
		res.json({ book });
	} catch (err) {
		return next(
			createHttpError({
				error: err,
			})
		);
	}
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const _req = req as AuthRequest;
		const { title, genre } = req.body;
		const bookId = req.params.bookId;
		const book = await bookModel.findOne({ _id: bookId });

		if (!book) {
			return next(createHttpError(404, "Book Not Found"));
		}

		if (book.author.toString() != _req.userId) {
			return next(createHttpError(403, "Unauthorised"));
		}

		const files = req.files as { [filename: string]: Express.Multer.File[] }; // Remember this line
		let completeCoverImage = "";
		if (files.coverImage) {
			const filename = files.coverImage[0].filename;
			const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);
			const filePath = path.resolve(
				__dirname,
				"../../public/data/uploads/" + filename
			);
			completeCoverImage = filename;
			const uploadResult = await cloudinary.uploader.upload(filePath, {
				filename_override: completeCoverImage,
				folder: "book-covers",
				format: coverMimeType,
			});
			completeCoverImage = uploadResult.secure_url;
			await fs.promises.unlink(filePath);
		}
		// For Book Section
		let completeFileImage = "";
		if (files.file) {
			const bookFilename = files.file[0].filename;
			const bookMimeType = files.file[0].mimetype.split("/").at(-1);
			const bookfilePath = path.resolve(
				__dirname,
				"../../public/data/uploads/" + bookFilename
			);
			completeFileImage = bookFilename;
			const uploadResult = await cloudinary.uploader.upload(bookfilePath, {
				filename_override: completeFileImage,
				folder: "book-covers",
				format: bookMimeType,
			});
			completeFileImage = uploadResult.secure_url;
			await fs.promises.unlink(bookfilePath);
		}
		const updateBook = await bookModel.findOneAndUpdate(
			{
				_id: bookId,
			},
			{
				title: title,
				genre: genre,
				coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
				file: completeFileImage ? completeFileImage : book.file,
			},
			{ new: true }
		);
		res.json({ updateBook });
	} catch (err) {
		res.json({ error: err });
	}
};
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
	res.json({});
};

export { createBook, getBook, listBook, updateBook, deleteBook };
