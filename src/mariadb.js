
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.MARIADBHOST ||'localhost',
  user: process.env.MARIADBUSER ||'root',
  password: process.env.MARIADBPSW || 'admin',
  database: process.env.MARIADBDATABASE || 'artlas',
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

async function getTocken(userId){
    let conn;
    try {
        conn = await pool.getConnection();
        let token = await conn.query("SELECT * FROM `token` WHERE `userId`=? ORDER BY `id` DESC LIMIT 1",[userId])
        if(token.length==0){
            await conn.query("INSERT INTO `token` (`userId`) VALUES (?);",[userId]);
            token = await conn.query("SELECT * FROM `token` WHERE `userId`=? ORDER BY `id` DESC LIMIT 1",[userId])
        }
        return token;
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

async function checkToken(token){
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.execute('SELECT * FROM `token` WHERE `token`=?',[token]);
        if(rows.length==0){
            return false
        }else{
            return rows
        }
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}


module.exports = {
    query,
    checkConnection,
    getTocken,
    checkToken
};
