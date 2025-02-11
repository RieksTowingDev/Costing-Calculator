const sql = require('mssql');

const config = {
    user: 'Masters',
    password: 'Dev@Riekstowing1649',
    server: 'DESKTOP-A1T054C',
    database: 'CostingCalc',
    options: {
        trustServerCertificate: true,
        encrypt: true, // Use this if you're on Windows Azure
        enableArithAbort: true
    }
};

async function connectToDatabase() {
    try {
        export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/beverages") {
      // If you did not use `DB` as your binding name, change it here
      const { results } = await env.DB.prepare(
        "SELECT * FROM Customers WHERE CompanyName = ?",
      )
        .bind("Bs Beverages")
        .all();
      return Response.json(results);
    }

    return new Response(
      "Call /api/beverages to see everyone who works at Bs Beverages",
    );
  },
};
        //await sql.connect(config);
        console.log('Connected to the database successfully');
    } catch (err) {
        console.error('Database connection failed: ', err);
    }
}

module.exports = {
    connectToDatabase
};
