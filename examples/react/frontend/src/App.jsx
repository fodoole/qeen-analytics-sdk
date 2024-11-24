import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Item from "./pages/Item";
import Category from "./pages/Category";
import Tag from "./pages/Tag";
import Cart from "./pages/Cart";
import { PageDataProvider } from './components/PageDataContext'; // Import the provider

function App() {
  return (
    <PageDataProvider>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="/products/:id" element={<Item />} />
          <Route path="/categoreis/:id" element={<Category />} />
          <Route path="/tags/:id" element={<Tag />} />
          <Route path="/cart" element={<Cart />} />
      </Routes>
    </PageDataProvider>
  );
}

export default App;
