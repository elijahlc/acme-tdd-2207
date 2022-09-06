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

Product.belongsTo(Category);
Category.hasMany(Product);

module.exports = {
  conn,
  Category,
  Product
};
