import Button from 'react-bootstrap/Button';
import { CartContext } from '../CartContext';
import { useContext, useEffect, useState } from 'react';

function CartProduct(props) {
  const cart = useContext(CartContext);
  const id = props.id;
  const quantity = props.quantity;

  const [productData, setProductData] = useState(null);

  useEffect(() => {
    // Fetch product data from the backend
    fetch(`http://localhost:4000/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProductData(data));
  }, [id]);

  // If the data is not yet fetched, show loading or placeholder
  if (!productData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h3>{productData.title}</h3>
      <p>{quantity} total</p>
      <p>${(quantity * productData.price).toFixed(2)}</p>
      <Button size="sm" onClick={() => cart.deleteFromCart(id)}>
        Remove
      </Button>
      <hr />
    </>
  );
}

export default CartProduct;
