import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Catalog = () => {
  const { addToCart, isLoggedIn, setShowLoginModal } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('backendsriram.azurewebsites.net/api/Product');

        // Access products array inside the "$values" property
        if (response.data && response.data.$values && Array.isArray(response.data.$values)) {
          setProducts(response.data.$values);
        } else {
          console.error('Expected an array of products in the "$values" property, but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.Category === selectedCategory)
    : products;

  // Group products by Category, and then sort by Id within each category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.Category]) {
      acc[product.Category] = [];
    }
    acc[product.Category].push(product);
    return acc;
  }, {});

  // Sort each category's products by Id
  Object.keys(groupedProducts).forEach(category => {
    groupedProducts[category].sort((a, b) => a.Id - b.Id); // Sort by Id
  });

  const categories = [...new Set(products.map(product => product.Category))];

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="container py-4">
      <h2>Product Catalog</h2>

      {/* Category Dropdown */}
      <div className="mb-3">
        <label htmlFor="category" className="form-label">Select Category</label>
        <select
          id="category"
          className="form-select"
          onChange={handleCategoryChange}
          value={selectedCategory}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div className="row">
        {Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts).map(category => (
            <div key={category} className="col-12 mb-4">
              <h4>{category}</h4>
              <div className="row">
                {groupedProducts[category].map(product => (
                  <div key={product.Id} className="col-md-3 mb-4">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{product.Name}</h5>
                        <p className="card-text">Price: ${product.Price}</p>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default Catalog;
