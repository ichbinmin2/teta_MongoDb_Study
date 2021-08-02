import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCartItems, removeCartItem } from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";

function CartPage(props) {
  const dispatch = useDispatch();
  const [Total, setTotal] = useState(0);
  useEffect(() => {
    let cartItems = [];
    // 리덕스 user state 안에  cart 안에 상푸밍 들어있는지 확인
    // 만약 user 안의 userData가 있다면 && user 안의 userData 안의 cart가 있다면
    if (props.user.userData && props.user.userData.cart) {
      // 만약 user 안의 userData 안의 cart 의 길이가 0 이상이라면 (카트 상품이 1개 이상이라면)
      if (props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });

        dispatch(getCartItems(cartItems, props.user.userData.cart)).then(
          (response) => {
            calculateTotal(response.payload);
          }
        );
      }
    }
  }, [props.user.userData]);

  const calculateTotal = (cartDetail) => {
    let total = 0;
    cartDetail.map(
      (item) => (total += parseInt(item.price, 10) * item.quantity)
    );

    setTotal(total);
  };

  const removeFromCart = (productId) => {
    dispatch(removeCartItem(productId));
  };

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1> My Cart</h1>

      <div>
        <UserCardBlock
          products={props.user.cartDetail}
          removeItem={removeFromCart}
        />
      </div>

      <div>
        <h2>Total Amount : $ {Total} </h2>
      </div>
    </div>
  );
}

export default CartPage;
