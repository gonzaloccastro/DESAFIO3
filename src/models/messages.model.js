import mongoose from "mongoose";

const useCollection = "messages";

const userSchema = new mongoose.Schema({
    user: String,
    message: String,   
});

export const messagesModel = mongoose.model(useCollection, userSchema);


