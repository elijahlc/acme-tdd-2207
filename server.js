const app = require('./app');
const { conn, seedData } = require('./db');

const setup = async()=> {
  try {
    await conn.sync({ force: true });
    await seedData();
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

setup();
