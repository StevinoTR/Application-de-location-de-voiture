require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // Detect dialect from URL
  const url = new URL(process.env.DATABASE_URL);
  const dialect = url.protocol.replace(':', ''); // postgres or mysql
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: dialect,
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeout: 60000,
    },
    pool: {
      max:     5,
      min:     0,
      acquire: 60000,
      idle:    10000,
    },
  });
} else {
  // Local XAMPP
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host:    process.env.DB_HOST || 'localhost',
      port:    process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
    }
  );
}

// Test de connexion au démarrage
sequelize.authenticate()
  .then(() => console.log('✅ Base de données connectée'))
  .catch(err => console.error('❌ Erreur BDD :', err.message));

module.exports = sequelize;