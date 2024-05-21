import express, { Request, Response, NextFunction } from "express";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
	res.json({});
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
