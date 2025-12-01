import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();


const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const testConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Connexion à la base de données réussie');
        connection.release();
    } catch (error) {
        console.error('❌ Erreur de connexion à la base de données:', error.message);
    }
};

export { db, testConnection };
export default db;