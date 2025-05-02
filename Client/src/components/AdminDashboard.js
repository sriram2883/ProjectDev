import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const { isLoggedIn, isAdmin } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productData, setProductData] = useState({ Name: '', Price: '', Category: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://backendsriram.azurewebsites.net/api/Product');
      const productList = response.data.$values;
      setProducts(productList);
      const uniqueCategories = [...new Set(productList.map(p => p.Category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.Category === selectedCategory)
    : products;

  // Group products by Category, and then sort by Id within each category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.Category]) {
      acc[product.Category] = [];
    }
    acc[product.Category].push(product);
    return acc;
  }, {});

  Object.keys(groupedProducts).forEach(category => {
    groupedProducts[category].sort((a, b) => a.Id - b.Id); // Sort by Id
  });

  const handleShowModal = (product = null) => {
    if (product) {
      setEditProduct(product);
      setProductData({ Name: product.Name, Price: product.Price, Category: product.Category });
    } else {
      setEditProduct(null);
      setProductData({ Name: '', Price: '', Category: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductData({ Name: '', Price: '', Category: '' });
    setEditProduct(null);
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSaveProduct = async () => {
    try {
      const payload = {
        ...productData,
        Price: parseFloat(productData.Price),
        ...(editProduct && { Id: editProduct.Id }) // Include Id if editing
      };

      if (!payload.Category.trim()) {
        alert('Category cannot be empty');
        return;
      }

      if (editProduct) {
        await axios.put(`https://backendsriram.azurewebsites.net/api/Product/${editProduct.Id}`, payload);
      } else {
        await axios.post('https://backendsriram.azurewebsites.net/api/Product', payload);
      }

      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`https://backendsriram.azurewebsites.net/api/Product/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container py-4">
      <h2>Admin Dashboard</h2>

      {/* Add Product */}
      <button className="btn btn-primary mt-4" onClick={() => handleShowModal()}>
        Add New Product
      </button>

      <br /><br />

      {/* Category Filter */}
      <div className="mb-3">
        <label htmlFor="category" className="form-label">Select Category</label>
        <select
          id="category"
          className="form-select"
          onChange={handleCategoryChange}
          value={selectedCategory}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
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
                        <p className="card-text">Category: {product.Category}</p>
                        <button
                          className="btn btn-secondary me-2"
                          onClick={() => handleShowModal(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteProduct(product.Id)}
                        >
                          Delete
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

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="productName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="Name"
                value={productData.Name}
                onChange={handleProductChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="Price"
                value={productData.Price}
                onChange={handleProductChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                list="categoryOptions"
                name="Category"
                value={productData.Category}
                onChange={handleProductChange}
                placeholder="Select or enter new category"
              />
              <datalist id="categoryOptions">
                {categories.map(category => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            {editProduct ? 'Save Changes' : 'Add Product'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
