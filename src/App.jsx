import React, { useState } from 'react';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CategoryStrip from './components/CategoryStrip.jsx';
import BrandStatement from './components/BrandStatement.jsx';
import EmailSignup from './components/EmailSignup.jsx';
import Footer from './components/Footer.jsx';
import ProductModal from './components/ProductModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Checkout from './components/Checkout.jsx';
import OrderConfirmed from './components/OrderConfirmed.jsx';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const addToCart = (product, size, quantity) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.productId === product.id && item.size === size);
      if (existing) {
        return current.map((item) => item.productId === product.id && item.size === size
          ? { ...item, qty: Math.min(10, item.qty + quantity) }
          : item);
      }
      return [...current, { productId: product.id, name: product.name, price: product.price, image: product.image, size, qty: quantity }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1) {
      setCartItems((current) => current.filter((item) => !(item.productId === productId && item.size === size)));
      return;
    }
    setCartItems((current) => current.map((item) => item.productId === productId && item.size === size ? { ...item, qty: Math.min(10, quantity) } : item));
  };

  const removeItem = (productId, size) => {
    setCartItems((current) => current.filter((item) => !(item.productId === productId && item.size === size)));
  };

  const openCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const completeOrder = (result) => {
    setCheckoutOpen(false);
    setCartItems([]);
    setConfirmedOrder(result.order_number);
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal font-inter flex flex-col selection:bg-charcoal selection:text-cream">
      <AnnouncementBar />
      <Navbar cartCount={cartItems.reduce((total, item) => total + item.qty, 0)} onOpenCart={() => setCartOpen(true)} />
      <main className="flex-grow">
        <Hero />
        <CategoryStrip onSelectProduct={setSelectedProduct} />
        <BrandStatement />
        <EmailSignup />
      </main>
      <Footer />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}
      {cartOpen && <CartDrawer items={cartItems} onClose={() => setCartOpen(false)} onUpdateQuantity={updateQuantity} onRemove={removeItem} onCheckout={openCheckout} />}
      {checkoutOpen && <Checkout items={cartItems} onClose={() => setCheckoutOpen(false)} onComplete={completeOrder} />}
      {confirmedOrder && <OrderConfirmed orderNumber={confirmedOrder} onClose={() => setConfirmedOrder(null)} />}
    </div>
  );
}

