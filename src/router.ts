import express from 'express';
import { Request, Response } from "express";

const router = express.Router();

router.get("/", (request: Request, response: Response) => {
    response.send("hello ss");
});

export default router;