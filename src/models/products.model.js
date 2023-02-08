import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const useCollection = "products";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnail: String,
    status: Boolean,
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(useCollection, productSchema);