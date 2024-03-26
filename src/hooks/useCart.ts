import { useEffect, useMemo, useState } from 'react';
import { db } from '../data/db';
import type { CarItem, Guitar } from '../types/types';

export const useCart = () => {
  const initialCart = (): CarItem[] => {
    const localstorageCart = localStorage.getItem('cart');
    return localstorageCart ? JSON.parse(localstorageCart) : [];
  };
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);
  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * The function `addToCart` checks if an item is already in the cart, increments its quantity if so,
   * or adds it with a quantity of 1 if not.
   * @returns The `addToCart` function is adding an item to the cart. If the item already exists in the
   * cart, it increments the quantity of that item by 1. If the item does not exist in the cart, it adds
   * the item with a quantity of 1 to the cart. The function does not explicitly return anything as it
   * is updating the cart state using the `setCart` function.
   */
  function addToCart(item: Guitar) {
    const itemExist = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExist >= 0) {
      if (cart[itemExist].quantity >= MAX_ITEMS) return;
      //Si existe en el carrito
      //Le sacamos una copia para no mutar directamente el estado
      const updatedCart = [...cart];
      //Accedemos a la posición e incrementamos
      updatedCart[itemExist].quantity++;
      //Llamamos a la función que actualiza para que lo modifique
      setCart(updatedCart);
    } else {
      const newItem: CarItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
    }
  }

  /**
   * The function removeFromCart removes a guitar item from the cart based on its id.
   */
  function removeFromCart(id: Guitar['id']) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  /**
   * The function `increaseQuantity` increments the quantity of a specific item in a cart if it is
   * below a maximum limit.
   */
  function increaseQuantity(id: Guitar['id']) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  /**
   * The function `decreaseQuantity` decreases the quantity of a specific item in a cart array in React
   * by 1, if the quantity is greater than a minimum threshold.
   */
  function decreaseQuantity(id: Guitar['id']) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  /**
   * The function `clearCart` clears the contents of the cart by setting it to an empty array.
   */
  function clearCart() {
    setCart([]);
  }

  /* Header - Code */

  //State derivado
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const carTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isEmpty,
    carTotal,
  };
};
