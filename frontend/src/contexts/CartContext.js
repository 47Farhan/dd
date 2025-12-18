import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item._id === action.payload._id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  }
};

const initialState = {
  items: []
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const { user } = useAuth();
  const saveTimeout = useRef();

  // Helper to normalize items to server shape (productId, name, price, quantity, image)
  const normalizeForServer = (items) => {
    return items.map(i => ({
      productId: i._id || i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image || ''
    }));
  };

  // Merge server and local carts (sums quantities)
  const mergeCarts = (localItems, serverItems) => {
    const map = new Map();
    serverItems.forEach(it => {
      const id = String(it.productId || it._id);
      map.set(id, { _id: id, name: it.name, price: it.price, quantity: it.quantity || 1, image: it.image || '' });
    });
    localItems.forEach(it => {
      const id = String(it._id || it.productId);
      if (map.has(id)) {
        map.get(id).quantity += it.quantity || 1;
      } else {
        map.set(id, { _id: id, name: it.name, price: it.price, quantity: it.quantity || 1, image: it.image || '' });
      }
    });
    return Array.from(map.values());
  };

  // On login, fetch server cart and merge with local cart
  useEffect(() => {
    const syncFromServer = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!user || !token) return;

        const res = await fetch('/api/users/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return; // silently ignore
        const data = await res.json();
        const serverCart = data.cart || [];
        const merged = mergeCarts(state.items, serverCart);
        dispatch({ type: 'LOAD_CART', payload: merged });
        localStorage.setItem('cart', JSON.stringify(merged));

        // Persist merged cart to server
        await fetch('/api/users/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart: normalizeForServer(merged) }),
        });
      } catch (err) {
        console.error('Failed to sync cart from server', err);
      }
    };

    syncFromServer();
  }, [user]);

  // When cart changes and user is logged in, debounce saving to server
  useEffect(() => {
    const pushToServer = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!user || !token) return;
        await fetch('/api/users/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart: normalizeForServer(state.items) }),
        });
      } catch (err) {
        console.error('Failed to push cart to server', err);
      }
    };

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(pushToServer, 1000);

    return () => clearTimeout(saveTimeout.current);
  }, [state.items, user]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};