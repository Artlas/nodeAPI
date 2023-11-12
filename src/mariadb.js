
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.MARIADBHOST ||'ahddry.fr',
  user: process.env.MARIADBUSER ||'adri',
  password: process.env.MARIADBPSW || 'aurelebg',
  database: process.env.MARIADBDATABASE || 'bdd_test',
  connectionLimit: 5
});

async function query(sql, values) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql, values);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function checkConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.ping();
        return true;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = {
    query,
    checkConnection,
};
