module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/investmentgame'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
