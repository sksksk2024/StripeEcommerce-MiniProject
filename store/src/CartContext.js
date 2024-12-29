import { createContext, useState } from 'react';

export const CartContext = createContext({
  items: [],
  getProductQuantity: () => {},
  addOneToCart: () => {},
  removeOneFromCart: () => {},
  deleteFromCart: () => {},
  getTotalCost: () => {},
});

export function CartProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);

  // [ { id: 1 , quantity: 3 }, { id: 2, quantity: 1 } ]

  function getProductQuantity(id) {
    const quantity = cartProducts.find(
      (product) => product.id === id
    )?.quantity;
    return quantity === undefined ? 0 : quantity;
  }

  function addOneToCart(id) {
    const quantity = getProductQuantity(id);

    if (quantity === 0) {
      setCartProducts([...cartProducts, { id: id, quantity: 1 }]);
    } else {
      setCartProducts(
        cartProducts.map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
    }
  }

  function removeOneFromCart(id) {
    const quantity = getProductQuantity(id);

    if (quantity === 1) {
      deleteFromCart(id);
    } else {
      setCartProducts(
        cartProducts.map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
      );
    }
  }

  function deleteFromCart(id) {
    setCartProducts((cartProducts) =>
      cartProducts.filter((currentProduct) => currentProduct.id !== id)
    );
  }

  // Function to fetch product data from the backend
  async function fetchProductData(id) {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${id}`);
      const productData = await response.json();
      return productData; // Returns the product data
    } catch (error) {
      console.error('Error fetching product data:', error);
      return null; // Return null in case of error
    }
  }

  async function getTotalCost() {
    let totalCost = 0;

    // Fetch product data for each cart item and calculate total cost
    for (const cartItem of cartProducts) {
      const productData = await fetchProductData(cartItem.id);
      if (productData) {
        totalCost += productData.price * cartItem.quantity;
      }
    }

    // Ensure totalCost is a number and return it
    return totalCost || 0; // If totalCost is undefined or NaN, return 0
  }

  const contextValue = {
    items: cartProducts,
    getProductQuantity,
    addOneToCart,
    removeOneFromCart,
    deleteFromCart,
    getTotalCost,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export default CartProvider;
