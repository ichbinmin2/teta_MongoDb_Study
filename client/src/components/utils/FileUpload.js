import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Icon } from "antd";
import axios from "axios";

function FileUpload(props) {
  const [images, setImages] = useState([]);

  const dropHandler = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    // 엔드포인트 "/api/product/image"
    axios.post("/api/product/image", formData, config).then((response) => {
      if (response.data.success) {
        console.log(response.data);
        setImages([...images, response.data.filePath]);
        // 부모 component인 UploadProductPage에 image 정보를 전달해주는 작업 진행
        props.refreshFunction([...images, response.data.filePath]);
      } else {
        alert("파일을 저장하는데 실패했습니다.");
      }
    });
  };

  // image 삭제
  const deleteHandler = (image) => {
    const currentIndex = images.indexOf(image);
    let newImages = [...images];
    newImages.splice(currentIndex, 1);
    setImages(newImages);
    // 부모 component인 UploadProductPage에 image 정보를 전달해주는 작업 진행
    props.refreshFunction(newImages);
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: 300,
              height: 240,
              border: "1px solid lightgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Icon type="plus" style={{ fontSize: "3rem" }} />
          </div>
        )}
      </Dropzone>
      <div
        style={{
          display: "flex",
          width: "350px",
          height: "240px",
          overflowX: "hidden",
        }}
      >
        {images.map((image, index) => (
          <div onClick={() => deleteHandler(image)} key={index}>
            <img
              style={{ minWidth: "300px", width: "300px", height: "240px" }}
              src={`http://localhost:5000/${image}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
