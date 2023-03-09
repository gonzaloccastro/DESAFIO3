import mongoose, { Schema } from "mongoose";

const userCollection = "usuarios";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: {
        type: [
            {
                cart: {type: Schema.Types.ObjectId, ref: 'carts'},
            }
        ], default: []
    },
    role: { type: String, required: true, default: 'user' },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;