import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductsPage from './pages/ProductsPage';
import AuthPage from './pages/AuthPage';
import PurchasePage from './pages/PurchasePage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import { authService } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        try {
          const response = await authService.getCurrentUser();
          if (response.data) {
            setUser(response.data);
            setIsAuthenticated(true);
            setAuthError(false);
          }
        } catch (error) {
          if (!authError && error.response?.status === 401) {
            try {
              await authService.refresh();
              const userResponse = await authService.getCurrentUser();
              if (userResponse.data) {
                setUser(userResponse.data);
                setIsAuthenticated(true);
                setAuthError(false);
              }
            } catch (refreshError) {
              setAuthError(true);
              setIsAuthenticated(false);
              setUser(null);
            }
          } else {
            setAuthError(true);
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [authError]);
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  const login = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setAuthError(false);
  };
  
  const logout = async () => {
    try {
      await authService.logout();
      setAuthError(true);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
      setAuthError(true);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeCartItem = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };
  
  if (loading) {
    return <div className="loading-screen">Загрузка...</div>;
  }
  
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated && !loading) {
      return <Navigate to="/auth" />;
    }
    
    if (loading) {
      return <div className="loading-screen">Загрузка...</div>;
    }
    
    return children;
  };

  const AdminRoute = ({ children }) => {
    if ((!isAuthenticated || !user?.isAdmin) && !loading) {
      return <Navigate to="/" />;
    }
    
    if (loading) {
      return <div className="loading-screen">Загрузка...</div>;
    }
    
    return children;
  };
  
  return (
    <Router>
      <Header 
        isAuthenticated={isAuthenticated} 
        user={user}
        onLogout={logout}
        cartItemsCount={cart.reduce((total, item) => total + item.quantity, 0)}
      />
      <div className="container">
        <Routes>
          <Route 
            path="/" 
            element={
              <ProductsPage 
                cart={cart} 
                onAddToCart={addToCart}
              />
            } 
          />
          <Route 
            path="/auth" 
            element={
              isAuthenticated ? 
                <Navigate to="/" /> : 
                <AuthPage onLogin={login} />
            } 
          />
          <Route 
            path="/purchase" 
            element={
              <ProtectedRoute>
                <PurchasePage 
                  cart={cart}
                  onUpdateQuantity={updateCartItemQuantity}
                  onRemoveItem={removeCartItem}
                  onClearCart={clearCart}
                  user={user}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPage user={user} />
              </AdminRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 