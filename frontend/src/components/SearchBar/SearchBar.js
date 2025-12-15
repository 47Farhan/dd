import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        🔍
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    maxWidth: '400px',
    margin: '0 auto 2rem'
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '1px solid #ddd',
    borderRight: 'none',
    borderRadius: '4px 0 0 4px',
    fontSize: '1rem'
  },
  button: {
    padding: '0.75rem 1rem',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};

export default SearchBar;