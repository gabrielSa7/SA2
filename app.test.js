const mysql = require('mysql2/promise');

let connection;

beforeAll(async () => {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'estetica_plus'
  });
});

afterAll(async () => {
  await connection.execute('DELETE FROM agendamentos'); // Limpeza após os testes
  await connection.end();
});



describe('Testes de integração com CRUD de agendamentos', () => {

  // Teste de Inserção
  test('Deve inserir um novo agendamento', async () => {
    const [result] = await connection.execute(
      'INSERT INTO agendamentos (nome_pessoa, contato_telefônico, email, data_agendamento) VALUES (?, ?, ?, ?)',
      ['Maria Silva', '123456789', 'maria@email.com', '2024-10-05']
    );
    expect(result.affectedRows).toBe(1);
  });
  const db = require('./db');  // Supondo que você tenha um arquivo para conexão ao banco
  
  // Teste de Leitura de dados - Select por nome completo
  test('Deve selecionar um agendamento pelo nome', async () => {
    const [rows] = await connection.execute(
      'SELECT * FROM agendamentos WHERE nome_pessoa = ?',
      ['Maria Silva']
    );
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].nome_pessoa).toBe('Maria Silva');
  });

  // Teste de Leitura de dados - Select por parte do nome
  test('Deve selecionar um agendamento por parte do nome', async () => {
    const [rows] = await connection.execute(
      'SELECT * FROM agendamentos WHERE nome_pessoa LIKE ?',
      ['%Maria%']
    );
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].nome_pessoa).toContain('Maria');
  });

  // Teste de Leitura por intervalo de datas
  describe('Teste de Leitura por Intervalo de Datas', () => {
    test('Deve selecionar agendamentos dentro de um intervalo de datas', async () => {
      const dataInicio = new Date('2024-10-01');
      const dataFim = new Date('2024-10-10');
  
      // Consulta SQL para buscar agendamentos dentro do intervalo
      const query = `
        SELECT * FROM agendamentos 
        WHERE data_agendamento >= ? AND data_agendamento <= ?;
      `;
      
      const agendamentos = await db.query(query, [dataInicio, dataFim]);
  
      // Verificando se os agendamentos retornados estão dentro do intervalo
      agendamentos.forEach((agendamento) => {
        const dataAgendamento = new Date(agendamento.data_agendamento);
  
        // Convertendo as datas para timestamps (milissegundos)
        expect(dataAgendamento.getTime()).toBeGreaterThanOrEqual(dataInicio.getTime());
        expect(dataAgendamento.getTime()).toBeLessThanOrEqual(dataFim.getTime());
      });
    });
  });

  // Teste de Atualização
  test('Deve atualizar o contato telefônico de um agendamento', async () => {
    const [updateResult] = await connection.execute(
      'UPDATE agendamentos SET contato_telefônico = ? WHERE nome_pessoa = ?',
      ['987654321', 'Maria Silva']
    );
    expect(updateResult.affectedRows).toBe(1);

    const [updatedRows] = await connection.execute(
      'SELECT * FROM agendamentos WHERE nome_pessoa = ?',
      ['Maria Silva']
    );
    expect(updatedRows[0].contato_telefônico).toBe('987654321');
  });

  // Teste de Delete
  test('Deve deletar um agendamento pelo nome', async () => {
    const [deleteResult] = await connection.execute(
      'DELETE FROM agendamentos WHERE nome_pessoa = ?',
      ['Maria Silva']
    );
    expect(deleteResult.affectedRows).toBe(1);

    const [rowsAfterDelete] = await connection.execute(
      'SELECT * FROM agendamentos WHERE nome_pessoa = ?',
      ['Maria Silva']
    );
    expect(rowsAfterDelete.length).toBe(0);
  });
});
