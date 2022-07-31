import mongoose from "mongoose";

export let Essay = mongoose.model("Essay", new mongoose.Schema({
    name: String,
    rawEssayBody: String,
    creationTime: Date,
    grade: Object
}));