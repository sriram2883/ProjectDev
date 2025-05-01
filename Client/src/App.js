import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './components/Home';
import Catalog from './components/Catalog';
import Orders from './components/Orders';
import Cart from './components/Cart';
import AppProvider, { AppContext } from './context/AppContext';
import LoginModal from './components/LoginModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Billing from './components/Billing';

const AppContent = () => {
  const { showLoginModal, setShowLoginModal } = useContext(AppContext);

  return (
    <>
      <Navbar />
      {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/billing' element={<Billing />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
