const sql = require('mssql');

const config = {
    user: 'Masters',
    password: 'Dev@Riekstowing1649',
    server: 'localhost',
    database: 'CostingCalc',
    options: {
        trustServerCertificate: true,
        encrypt: true, // Use this if you're on Windows Azure
        enableArithAbort: true
    }
};

async function connectToDatabase() {
    try {
        await sql.connect(config);
        console.log('Connected to the database successfully');
    } catch (err) {
        console.error('Database connection failed: ', err);
    }
}

module.exports = {
    connectToDatabase
};
