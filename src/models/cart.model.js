import mongoose from "mongoose";

const useCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: {
        type: [
          {
            products: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "products",
            },
          },
        ],
        default: [],
      },  
});

cartSchema.pre("find", function () {
    this.populate("products.product");
  });

export const cartModel = mongoose.model(useCollection, cartSchema);


