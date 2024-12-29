import { Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { useEffect, useState } from 'react';

function Store() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products data from the backend
    const backendUrl =
      process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
    fetch(`${backendUrl}/api/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  return (
    <>
      <h1 align="center" className="p-3">
        Welcome to the store!
      </h1>
      <Row xs={1} md={3} className="g-4">
        {products.map((product, idx) => (
          <Col align="center" key={idx}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default Store;
