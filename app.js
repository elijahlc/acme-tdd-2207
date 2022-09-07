const express = require('express');
const app = express();
const { Category, Product } = require('./db');
const path = require('path');

module.exports = app;

app.use(express.json());
app.use('/dist', express.static('dist'));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));


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
