const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    sold: {
      type: Number,
      maxlength: 100,
      default: 0,
    },
    continents: {
      type: Number,
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// MongoDB 검색 설정 : Control Search Results with Weights
productSchema.index(
  // 이름과, 설명 부분에서 검색 키워드가 걸릴 수 있도록 설정
  {
    title: "text",
    description: "text",
  },
  // 검색 중요도 설정. title이 description보다 5배 중요하게 검색을 하도록 설정할 수 있음.
  {
    weights: {
      title: 5,
      description: 1,
    },
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
