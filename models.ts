import mongoose from "mongoose";

export const Essay = mongoose.model("Essay", new mongoose.Schema({
    name: String,
    rawEssayBody: String,
    creationTime: Date,
    grade: Object,
    comment: String
}));