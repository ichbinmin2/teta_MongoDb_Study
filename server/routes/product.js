const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Product } = require("../models/Product");
//=================================
//             Product
//=================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single("file");

router.post("/image", (req, res) => {
  // 가져온 이미지를 저장해는 작업
  upload(req, res, (err) => {
    if (err) {
      return req.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.filename,
    });
  });
});

// index.js에서 맞춰준 포인트가 있기 때문에 굳이 /api/product 를 전부다 작성할 필요가 없음.
router.post("/", (req, res) => {
  // 받아온 정보들을 db에 넣어주는 작업

  const product = new Product(req.body);

  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/products", (req, res) => {
  // product 콜렉션에 들어있는 모든 상품 정보 가져오기

  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      console.log("key", key);

      if (key === "price") {
        // * price 데이터내에서 가격 범위(arayy[00 to 00])가 있기 때문에 필요한 옵션 *
        findArgs[key] = {
          // gte : mongoDB에서 사용하는 용어. 이것보다 크거나 같고(Greater than equal)
          $gte: req.body.filters[key][0],
          // let : mongoDB에서 사용하는 용어. 이것보다 작거나 같은(Less than equal)
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  console.log("findArgs", findArgs);

  // ** 검색값(term)이 있다면
  if (term) {
    Product.find(findArgs)
      // searchTerm이 있을 때는 find 조건을 추가한다.
      .find({ $text: { $search: term } })
      // populate 를 사용하면, 상품을 저장한 사람의 모든 정보를 가져올 수 있다.
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      });
  } else {
    Product.find(findArgs)
      // populate 를 사용하면, 상품을 저장한 사람의 모든 정보를 가져올 수 있다.
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      });
  }
});

router.get("/products_by_id", (req, res) => {
  // 받아온 정보들을 db에 넣어주는 작업
  // productId를 이용해서 DB에서 productId와 같은 상품 정보를 가져온다.
  let type = req.query.type;
  let productIds = req.query.id;

  if ((type = "array")) {
    // ex) id = 1234, 5678, 9012 를
    // productIds = [ '1234', '5678', '9012'] 로 바꿔주는 작업이다.
    let ids = req.query.id.split(",");
    productIds = ids.map((item) => {
      return item;
    });
  }

  //productId를 이용해서 DB에서  productId와 같은 상품의 정보를 가져온다.
  Product.find({ _id: { $in: productIds } })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(product);
    });
});

module.exports = router;
