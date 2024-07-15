import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import open from 'open'
import path from 'path'
import {initDB} from './scripts/database.js'

// Start System
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Redirect to Admin!
const __dirname = import.meta.dirname;
app.use('/admin', express.static(path.join(__dirname, '/public/admin')))

app.use(function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

async function startServer() {
    try {
        await initDB();
        console.log("----------------------------")
        app.listen(3030, () => {
            console.log('Opening PTSO on localhost');
            open('http://localhost:3030/admin');
        });
    } catch (error) {
        console.error('Failed to initialize database: ', error);
        process.exit(1);
    }
}

startServer();