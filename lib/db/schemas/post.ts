import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    company:String,
    title:String,
    description:String,
    thumbnailUrl:String,
    createdAt:Date,
    link:String,
    authorId:String,
});

const post = mongoose.models.post || mongoose.model("post",postSchema);

export default post;