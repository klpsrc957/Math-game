const express = require('express');
const app = express();
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = {
    user: 'testinglogin123',
    password: 'Team1@23',
    server: 'databaseformathkidapp.database.windows.net',
    database: 'databaseformathkidapp',
    options: {
        encrypt: true // For secure connection
    }
};
const dbconfig = 'Driver={ODBC Driver 18 for SQL Server};Server=tcp:databaseformathkidapp.database.windows.net,1433;Database=Kid_Math_App_Test1;Uid=testinglogin123;Pwd=Team1@23;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;Authentication=ActiveDirectoryPassword'

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.json({'name':"math app "});
});

app.get('/api/game-data', (req, res) => {
    sql.connect(dbconfig, (err) => {
        if (err) {
            console.log('Error connecting to database:', err);
            return;
        }
        // Perform the database query
        new sql.Request().query('SELECT * FROM username', (err, result) => {
            if (err) {
                console.log('Error querying database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            console.log('connected', res);
            res.json(result.recordset);
        });
    });
});
app.post('/api/data', (req, res) => {
    // Create a connection pool
    sql.connect(dbconfig, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error connecting to the database');
            return;
        }

        // Create a new SQL query
        const query = `INSERT INTO username (id, username) VALUES ('${req.body.id}', '${req.body.username}')`;

        // Execute the query
        const request = new sql.Request();
        request.query(query, (err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error executing the query');
                return;
            }

            res.send('Data successfully inserted');
        });
    });
});

const port = process.env.PORT||3001; // You can use any available port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});