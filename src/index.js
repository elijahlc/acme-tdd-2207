import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const root = createRoot(document.querySelector('#root'));


const App = ()=> {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  useEffect(()=> {
    const fetchCategories = async()=> {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      }
      catch(ex){
        console.log(ex);
      }
    };
    fetchCategories();
  }, []);

  useEffect(()=> {
    const fetchProducts = async()=> {
      const hash = window.location.hash.slice(1);
      if(!hash){
        setProducts([]);
      }
      else {
        try {
          const response = await axios.get(`/api/categories/${hash}/products`);
          setProducts(response.data);
        }
        catch(ex){
          console.log(ex);
        }
      }
    };
    window.addEventListener('hashchange', fetchProducts); 
    fetchProducts();
  }, []);
  return (
    <div>
      <h1><a href='#'>Acme TDD</a></h1>
      <nav style={{ display: 'flex', justifyContent: 'space-around'}}>
        {
          categories.map( category => {
            return (
              <a style={window.location.hash.slice(1) === category.id ? { border: 'solid 2px dodgerBlue'} : {} } href={`#${category.id}`} key={ category.id }>
                { category.name }
              </a>
            );
          })
        }
      </nav>
      <ul>
        {
          products.map( product => {
            return (
              <li key={ product.id }>{ product.name }</li>
            );
          })
        }
      </ul>
    </div>
  );
};

root.render(<App />);
