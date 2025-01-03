import { Button, Navbar, Modal } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import { CartContext } from '../CartContext';
import CartProduct from './CartProduct';

function NavbarComponent() {
  const cart = useContext(CartContext);
  const [show, setShow] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const checkout = async () => {
    const backendUrl =
      process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
    await fetch(`${backendUrl}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: cart.items }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.url) {
          window.location.assign(response.url); // Forwarding user to Stripe
        }
      });
  };

  const productsCount = cart.items.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  useEffect(() => {
    const fetchTotalCost = async () => {
      const cost = await cart.getTotalCost();
      setTotalCost(cost); // Set the fetched total cost
    };

    fetchTotalCost();
  }, [cart]);

  return (
    <>
      <Navbar expand="sm">
        <Navbar.Brand href="/">Ecommerce Store</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button onClick={handleShow}>Cart ({productsCount} Items)</Button>
        </Navbar.Collapse>
      </Navbar>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Shopping Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productsCount > 0 ? (
            <>
              <p>Items in your cart:</p>
              {cart.items.map((currentProduct, idx) => (
                <CartProduct
                  key={idx}
                  id={currentProduct.id}
                  quantity={currentProduct.quantity}
                />
              ))}
              <h1>Total: ${totalCost.toFixed(2)}</h1>
              <Button variant="success" onClick={checkout}>
                Purchase items!
              </Button>
            </>
          ) : (
            <h1>There are no items in your cart!</h1>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NavbarComponent;
