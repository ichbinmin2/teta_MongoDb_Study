import React, { useState } from "react";
import { Input } from "antd";

const { Search } = Input;

function SearchFeature(props) {
  const [searchTerm, setSearchTerm] = useState("");

  const searchHandler = (event) => {
    setSearchTerm(event.currentTarget.value);
    props.refreshFunction(event.currentTarget.value);
  };

  return (
    <div>
      <Search
        placeholder="input search text"
        onChange={searchHandler}
        style={{ width: 200 }}
        value={searchTerm}
      />
    </div>
  );
}

export default SearchFeature;
