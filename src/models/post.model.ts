import mongoose, { Schema } from "mongoose";
import { UserDocument } from "./user.model";

export type PostDocument = mongoose.Document & {
    title: string;
    author: UserDocument;
    content: string;
    tags: string[];
    category: string;
    creationDate: Date;
};

const postSchema = new mongoose.Schema({
    title: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    content: String,
    tags: Array,
    category: String,
    creationDate: Date
}, {timestamps: true});

export const Post = mongoose.model<PostDocument>("Post", postSchema);