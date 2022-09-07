const Sequelize = require('sequelize');
const { UUID, UUIDV4, STRING } = Sequelize;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_tdd_db');

const Category = conn.define('category', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});
const Product = conn.define('product', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

Product.findAllWithoutCategory = function(){
  return this.findAll({
    where: {
      categoryId: null
    }
  });
};

const seedData = async()=> {
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
};

Product.belongsTo(Category);
Category.hasMany(Product);

module.exports = {
  conn,
  Category,
  Product,
  seedData
};
