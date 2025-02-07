const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { connectToDatabase } = require('./databaseconnection');
const sql = require('mssql');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));

// Connect to the database
connectToDatabase().then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.error('Database connection failed:', err);
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const data = req.body;

    // Extract variables from the form data
    const vehicle = data.Vehicles || "N/A"; // Default to prevent undefined
    const callOut = data.CallOut || "N/A";
    const client = data.client || "Unknown Client";
    const jobnr = data.jobnr || "00000";
    const calloutTotal = Number(data.calloutTotal) || 0;
    const Traveltotal = Number(data.Traveltotal) || 0;
    const labourTotal = Number(data.labourTotal) || 0;
    const towtotal = Number(data.towtotal) || 0;
    const ADDtotal = Number(data.ADDtotal) || 0;
    const Tolltotal = Number(data.Tolltotal) || 0;
    const totalExclVAT = Number(data.totalExclVAT) || 0;
    const totalVAT = Number(data.totalVAT) || 0;
    console.log("Extracted Data:", {
        vehicle, callOut, client, jobnr, calloutTotal, Traveltotal, labourTotal, towtotal, ADDtotal, Tolltotal, totalExclVAT, totalVAT
    }); 
    

    try {
        const pool = await sql.connect();
        const request = pool.request();
        request.input('Vehicles', sql.VarChar, vehicle);
        request.input('CallOut', sql.VarChar, callOut);
        request.input('calloutTotal', sql.Float, calloutTotal);
        console.log(calloutTotal);
        request.input('Traveltotal', sql.Float, Traveltotal);
        request.input('labourTotal', sql.Float, labourTotal);
        request.input('towtotal', sql.Float, towtotal);
        request.input('ADDtotal', sql.Float, ADDtotal);
        request.input('Tolltotal', sql.Float, Tolltotal);
        request.input('totalExclVAT', sql.Float, totalExclVAT);
        request.input('totalVAT', sql.Float, totalVAT);
        request.input('Client', sql.VarChar, client);
        request.input('Jobnr', sql.Int, jobnr);
        console.log(vehicle, callOut, calloutTotal, Traveltotal, labourTotal, towtotal, ADDtotal, Tolltotal, totalExclVAT, totalVAT, client, jobnr);
        await request.query(`
            INSERT INTO CalculatedCosts (vehicle, callout, callouttotal, perkm, labourprep, kmtowed, additional, toll, totalexlvat, totalinclvat, client, jobrn)
            VALUES ('${vehicle}', @CallOut, @calloutTotal, @Traveltotal, @labourTotal, @towtotal, @ADDtotal, @Tolltotal, @totalExclVAT, @totalVAT, @Client, @Jobnr)
        `);

        res.json({ message: 'Data saved successfully', totalVAT});
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});