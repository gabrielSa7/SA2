const mysql = require('mysql2/promise');

// Configurações de conexão
const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root', 
  password: 'root', 
  database: 'estetica_plus',
});

// Função para executar consultas
const query = async (sql, params) => {
  const [results] = await pool.execute(sql, params);
  return results;
};

// Exportando a função de consulta
module.exports = {
  query,
};
