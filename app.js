const express = require('express');
const app = express();
const { Category, Product } = require('./db');

module.exports = app;

app.use(express.json());

app.get('/api/categories', async(req, res, next)=> {
  try {
    res.send(await Category.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/categories/:id/products', async(req, res, next)=> {
  try {
    res.status(201).send(await Product.create({ categoryId: req.params.id, ...req.body})); 
  }
  catch(ex){
    if(ex.name === 'SequelizeUniqueConstraintError'){
      next({ status: 409 });
    }
    else {
      next(ex);
    }
  }
});

app.get('/api/categories/:id/products', async(req, res, next)=> {
  try {
    res.send(await Product.findAll({
      where: {
        categoryId: req.params.id
      }
    }));
  }
  catch(ex){
    next(ex);
  }
});
