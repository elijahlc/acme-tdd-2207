const { expect } = require('chai');
const { conn, Category, Product } = require('./db');

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
    Product.create({ name: 'bar 3', categoryId: barCat.id })
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
  });
});
