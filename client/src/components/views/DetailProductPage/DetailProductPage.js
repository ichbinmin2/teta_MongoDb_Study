import React, { useEffect } from "react";
import axios from "axios";
const DetailProductPage = (props) => {
  const productId = props.match.parmas.productId;

  useEffect(() => {
    axios
      .get(`/api/product/products_by_id?id=${productId}&type=single`)
      .then((response) => {
        if (response.data.success) {
          console.log(`response.data : ${response.data} `);
        } else {
          alert("상세 페이지를 불러오는데 실패했습니다.");
        }
      });
  }, []);

  return <div>DetailProductPage</div>;
};

export default DetailProductPage;
