import React from 'react';

const FilterSidebar = ({ filters, onFilterChange, categories = [], brands = [] }) => {
  // Expect categories as array of category keys (e.g. ['men','women'])
  const defaultCategories = ['men', 'women', 'kids', 'electronics', 'clothing', 'accessories'];
  const categoryOptions = (Array.isArray(categories) && categories.length > 0) ? categories : defaultCategories;
  const brandOptions = (Array.isArray(brands) && brands.length > 0) ? brands : ['Nike', 'Adidas', 'Apple', 'Samsung', 'Sony'];
  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 to $50', min: 25, max: 50 },
    { label: '$50 to $100', min: 50, max: 100 },
    { label: 'Over $100', min: 100, max: Infinity }
  ];

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.title}>Filters</h3>

      {/* Category Filter */}
      <div style={styles.filterGroup}>
        <h4 style={styles.filterTitle}>Category</h4>
        {categoryOptions.map(category => {
          const value = String(category).toLowerCase();
          const display = value.charAt(0).toUpperCase() + value.slice(1);
          return (
            <label key={value} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.categories.includes(value)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.categories, value]
                    : filters.categories.filter(c => c !== value);
                  onFilterChange({ ...filters, categories: newCategories });
                }}
              />
              {display}
            </label>
          );
        })}
      </div>

      {/* Brand Filter */}
      <div style={styles.filterGroup}>
        <h4 style={styles.filterTitle}>Brand</h4>
        {brandOptions.map(brand => (
          <label key={brand} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.brands.includes(brand)}
              onChange={(e) => {
                const newBrands = e.target.checked
                  ? [...filters.brands, brand]
                  : filters.brands.filter(b => b !== brand);
                onFilterChange({ ...filters, brands: newBrands });
              }}
            />
            {brand}
          </label>
        ))}
      </div>

      {/* Price Filter */}
      <div style={styles.filterGroup}>
        <h4 style={styles.filterTitle}>Price Range</h4>
        {priceRanges.map(range => (
          <label key={range.label} style={styles.radioLabel}>
            <input
              type="radio"
              name="priceRange"
              checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
              onChange={() => onFilterChange({ ...filters, priceRange: range })}
            />
            {range.label}
          </label>
        ))}
        <label style={styles.radioLabel}>
          <input
            type="radio"
            name="priceRange"
            checked={!filters.priceRange}
            onChange={() => onFilterChange({ ...filters, priceRange: null })}
          />
          All Prices
        </label>
      </div>

      {/* Rating Filter */}
      <div style={styles.filterGroup}>
        <h4 style={styles.filterTitle}>Rating</h4>
        {[4, 3, 2, 1].map(rating => (
          <label key={rating} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.ratings.includes(rating)}
              onChange={(e) => {
                const newRatings = e.target.checked
                  ? [...filters.ratings, rating]
                  : filters.ratings.filter(r => r !== rating);
                onFilterChange({ ...filters, ratings: newRatings });
              }}
            />
            {'⭐'.repeat(rating)}+
          </label>
        ))}
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onFilterChange({
          categories: [],
          brands: [],
          priceRange: null,
          ratings: []
        })}
        style={styles.clearBtn}
      >
        Clear All Filters
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: 'fit-content'
  },
  title: {
    margin: '0 0 1rem 0',
    color: '#333',
    borderBottom: '2px solid #007bff',
    paddingBottom: '0.5rem'
  },
  filterGroup: {
    marginBottom: '1.5rem'
  },
  filterTitle: {
    margin: '0 0 0.75rem 0',
    color: '#555',
    fontSize: '1rem'
  },
  checkboxLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    cursor: 'pointer',
    color: '#666'
  },
  radioLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    cursor: 'pointer',
    color: '#666'
  },
  clearBtn: {
    width: '100%',
    padding: '0.75rem',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default FilterSidebar;