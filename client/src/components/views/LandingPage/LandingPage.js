import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon, Col, Card, Row } from "antd";
import Meta from "antd/lib/card/Meta";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "./Section/CheckBox";
import { continents } from "./Section/Datas";

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [postSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({ continents: [], price: [] });

  useEffect(() => {
    let body = {
      skip: Skip,
      limit: Limit,
    };

    getProducts(body);
  }, []);

  const getProducts = (body) => {
    axios.post("/api/product/products", body).then((response) => {
      if (response.data.success) {
        if (body.loadMore) {
          setProducts([...products, ...response.data.productInfo]);
        } else {
          setProducts(response.data.productInfo);
        }
        setPostSize(response.data.postSize);
      } else {
        alert("상품을 가져오는데 실패했습니다.");
      }
    });
  };

  const loadMoreHandler = () => {
    let skip = Skip + Limit;

    let body = {
      skip: skip,
      limit: Limit,
      loadMore: true,
    };

    getProducts(body);
    setSkip(skip);
  };

  const renderCards = products.map((item, index) => {
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card cover={<ImageSlider images={item.images} />}>
          <Meta title={item.title} description={`$${item.price}`} />
        </Card>
      </Col>
    );
  });

  const showFilteredResults = (filters) => {
    let body = {
      skip: 0,
      limit: 8,
      filters: filters,
    };

    getProducts(body);
    setSkip(0);
  };

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };
    newFilters[category] = filters;

    showFilteredResults(newFilters);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Trevel Anywhere <Icon type="rocket" />
        </h2>
      </div>

      {/* Filter */}

      {/* checkBox */}
      <CheckBox
        list={continents}
        handleFilters={(filters) => handleFilters(filters, "continents")}
      />
      {/* radioBox */}

      {/* Search */}

      {/* Cards */}
      <Row gutter={[16, 16]}>{renderCards}</Row>

      <br />

      {postSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={loadMoreHandler}>더보기</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
