import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      enum: {
        values: ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty', 'Other'],
        message: '{VALUE} is not a supported category',
      },
      default: 'Other',
    },
    image: {
      url: {
        type: String,
        required: [true, 'Product image is required'],
      },
      fileId: {
        type: String,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const productsModel = mongoose.model("products", productSchema);

export default productsModel;