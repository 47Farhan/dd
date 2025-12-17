import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import { productAPI } from '../../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: null,
    ratings: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [derivedCategories, setDerivedCategories] = useState([]);
  const [derivedBrands, setDerivedBrands] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      const data = response.data || {};
      const list = Array.isArray(data.products) ? data.products : [];
      setProducts(list);
      setFilteredProducts(list);
      // derive categories and brands for the sidebar
      const uniqueCategories = Array.from(new Set(list.map(p => String(p.category || 'other').toLowerCase())));
      const uniqueBrands = Array.from(new Set(list.map(p => p.brand || 'Unknown')));
      // store derived lists for sidebar
      setDerivedCategories(uniqueCategories);
      setDerivedBrands(uniqueBrands);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter (case-insensitive, backend uses lowercase: men/women/kids)
    if (filters.categories.length > 0) {
      const selected = filters.categories.map(c => c.toLowerCase());
      filtered = filtered.filter(product => selected.includes(String(product.category).toLowerCase()));
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product =>
        filters.brands.includes(product.brand)
      );
    }

    // Price filter
    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
      );
    }

    // Rating filter
    if (filters.ratings.length > 0) {
      filtered = filtered.filter(product => {
        const ratingValue = typeof product.rating === 'number' ? product.rating : (product.rating?.average || 0);
        return filters.ratings.some(rating => ratingValue >= rating);
      });
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return <div style={styles.loading}>Loading products...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Our Products</h1>
      
      <SearchBar onSearch={handleSearch} />
      
      <div style={styles.content}>
        <div style={styles.sidebar}>
          <FilterSidebar 
            filters={filters} 
            onFilterChange={setFilters}
            categories={derivedCategories}
            brands={derivedBrands}
          />
        </div>
        
        <div style={styles.productsGrid}>
          {filteredProducts.length === 0 ? (
            <div style={styles.noResults}>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gap: '2rem',
    alignItems: 'start'
  },
  sidebar: {
    position: 'sticky',
    top: '2rem'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem'
  },
  noResults: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '4rem',
    background: '#f8f9fa',
    borderRadius: '8px'
  }
};

export default Products;
