// import { createContext, useState, useContext, useEffect } from 'react';
// import API from '../api/axios';

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);

//   // 1. On Mount: Load from Backend if logged in, otherwise localStorage
//   useEffect(() => {
//     const initCart = async () => {
//       try {
//         const { data } = await API.get('/cart');
//         // Your backend returns { items: [...], total: ... }
//         setCart(data.items);
//       } catch (e) {
//         const savedCart = localStorage.getItem('flower_shop_cart');
//         if (savedCart) setCart(JSON.parse(savedCart));
//       }
//     };
//     initCart();
//   }, []);

//   // 2. Persist to localStorage for guests
//   useEffect(() => {
//     localStorage.setItem('flower_shop_cart', JSON.stringify(cart));
//   }, [cart]);

//   // ADD TO CART
//   const addToCart = async (product, quantity) => {
//     // Find current quantity in local state to send the correct TOTAL to the server
//     const existing = cart.find((item) => (item.product_id === product.id || item.id === product.id));
//     const newQuantity = existing ? existing.quantity + quantity : quantity;

//     // Update Local UI first
//     setCart((prev) => {
//       if (existing) {
//         return prev.map((item) =>
//           (item.product_id === product.id || item.id === product.id) 
//             ? { ...item, quantity: newQuantity } 
//             : item
//         );
//       }
//       return [...prev, { ...product, product_id: product.id, quantity: newQuantity }];
//     });

//     // Update Backend
//     try {
//       await API.post('/cart', { 
//         product_id: product.id, 
//         quantity: newQuantity // Sending the total quantity for this item
//       });
//     } catch (err) {
//       console.error("Server sync failed", err);
//     }
//   };

//   // UPDATE QUANTITY (e.g., from Cart page)
//   const updateQuantity = async (id, newQty) => {
//     if (newQty < 1) return;
    
//     // Update UI
//     setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: newQty } : item));

//     try {
//       // Your backend uses /cart/{cartItem}
//       await API.put(`/cart/${id}`, { quantity: newQty });
//     } catch (err) {
//       console.error("Failed to update quantity on server", err);
//     }
//   };

//   // REMOVE FROM CART
//   const removeFromCart = async (id) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
    
//     try {
//       // Backend expects the ID of the CartItem model
//       await API.delete(`/cart/${id}`);
//     } catch (err) {
//       console.error("Failed to remove from server", err);
//     }
//   };

//   const clearCart = () => {
//     setCart([]);
//     localStorage.removeItem('flower_shop_cart');
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => {
//       // Note: Backend nesting usually puts price inside item.product
//       const price = item.product?.discount_price || item.product?.price || item.discount_price || item.price;
//       return total + (price * item.quantity);
//     }, 0);
//   };

//   const getCartCount = () => {
//     return cart.reduce((total, item) => total + item.quantity, 0);
//   };

//   return (
//     <CartContext.Provider 
//       value={{ 
//         cart, 
//         addToCart, 
//         updateQuantity,
//         removeFromCart, 
//         clearCart, 
//         getCartTotal,
//         getCartCount
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within a CartProvider");
//   return context;
// };

import { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const initCart = async () => {
      try {
        const { data } = await API.get('/cart');
        setCart(data.items);
      } catch (e) {
        const savedCart = localStorage.getItem('flower_shop_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
      }
    };
    initCart();
  }, []);

  useEffect(() => {
    localStorage.setItem('flower_shop_cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * ADD TO CART logic with Stock-Aware Updating
   */
  const addToCart = async (product, quantity) => {
    // 1. Check what is already in the cart
    const existing = cart.find((item) => 
      (item.product_id === product.id || item.id === product.id)
    );
    
    const currentQtyInCart = existing ? existing.quantity : 0;
    
    // 2. If already at max stock, stop immediately
    if (currentQtyInCart >= product.stock) {
      alert(`You already have the maximum available (${product.stock}) in your cart.`);
      return false;
    }

    // 3. Calculate new total, but cap it at the stock limit
    let newTotalQuantity = currentQtyInCart + quantity;
    if (newTotalQuantity > product.stock) {
      alert(`Only ${product.stock} available. Your cart has been updated to the maximum limit.`);
      newTotalQuantity = product.stock;
    }

    // 4. Update Local State
    setCart((prev) => {
      if (existing) {
        return prev.map((item) =>
          (item.product_id === product.id || item.id === product.id) 
            ? { ...item, quantity: newTotalQuantity } 
            : item
        );
      }
      // Note: Ensure we store product_id and include product relation for consistency
      return [...prev, { ...product, product_id: product.id, quantity: newTotalQuantity }];
    });

    // 5. Sync with Backend
    try {
      await API.post('/cart', { 
        product_id: product.id, 
        quantity: newTotalQuantity 
      });
      return true;
    } catch (err) {
      console.error("Sync failed", err);
      return false;
    }
  };

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    const item = cart.find(i => i.id === id);
    if (item && newQty > (item.product?.stock || item.stock)) {
        alert("Maximum stock reached");
        return;
    }

    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: newQty } : i));
    try {
      await API.put(`/cart/${id}`, { quantity: newQty });
    } catch (err) { console.error(err); }
  };

  const removeFromCart = async (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    try { await API.delete(`/cart/${id}`); } catch (err) { console.error(err); }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('flower_shop_cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product?.discount_price || item.product?.price || item.discount_price || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);