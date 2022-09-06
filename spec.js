const { expect } = require('chai');
const { conn, Category, Product } = require('./db');
const app = require('supertest')(require('./app'));

beforeEach(async()=> {
  await conn.sync({ force: true });
  const [ fooCat, barCat, bazzCat ] = await Promise.all([
    Category.create({ name: 'foo category'}),
    Category.create({ name: 'bar category'}),
    Category.create({ name: 'bazz category'}),
  ]);
  await Promise.all([
    Product.create({ name: 'foo 1', categoryId: fooCat.id }),
    Product.create({ name: 'foo 2', categoryId: fooCat.id }),
    Product.create({ name: 'bar 1', categoryId: barCat.id }),
    Product.create({ name: 'bar 2', categoryId: barCat.id }),
    Product.create({ name: 'bar 3', categoryId: barCat.id }),
    Product.create({ name: 'quq 1' })
  ]);
});

describe('Models', ()=> {
  describe('seeded data', ()=> {
    it('there are 3 categories', async()=>  {
      const categories = await Category.findAll();
      expect(categories.length).to.equal(3);
    });
    it('the foo category has 2 products', async()=>  {
      const category = await Category.findOne({
        where: {
          name: 'foo category'
        },
        include: [ Product ]
      });
      expect(category.name).to.equal('foo category');
      expect(category.products.length).to.equal(2);
    });
    describe('Product.findAllWithoutCategory', ()=> {
      it('there is one product without a category', async()=> {
        const products = await Product.findAllWithoutCategory();
        expect(products.length).to.equal(1);
        expect(products[0].name).to.equal('quq 1');

      });
    });
  });
});

describe('Routes', ()=> {
  describe('GET /api/categories', ()=> {
    it('returns all the categories', async()=> {
      const response = await app.get('/api/categories');
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(3);
    });
  });
  describe('GET /api/categories/:id/products', ()=> {
    it('returns all the products for a category', async()=> {
      const category = await Category.findOne({
        where: {
          name: 'foo category'
        }
      });
      const response = await app.get(`/api/categories/${category.id}/products`);
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(2);
    });
  });
  describe('POST /api/categories/:id/products', ()=> {
    describe('successful', ()=> {
      it('returns the new product', async()=> {
        const category = await Category.findOne({
          where: {
            name: 'foo category'
          }
        });
        const response = await app.post(`/api/categories/${category.id}/products`)
          .send({ name: 'foo 3' });
        expect(response.status).to.equal(201);
      });
    });
    describe('unsuccessful', ()=> {
      describe('with an empty name', ()=> {
        it('returns the new product', async()=> {
          const category = await Category.findOne({
            where: {
              name: 'foo category'
            }
          });
          const response = await app.post(`/api/categories/${category.id}/products`)
            .send({ name: '' });
          expect(response.status).to.equal(500);
        });
      });
      describe('with a non unique name', ()=> {
        it('returns the new product', async()=> {
          const category = await Category.findOne({
            where: {
              name: 'foo category'
            }
          });
          const response = await app.post(`/api/categories/${category.id}/products`)
            .send({ name: 'foo 1' });
          expect(response.status).to.equal(409);
        });
      });
    });
  });
});
