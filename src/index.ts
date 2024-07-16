import express from 'express';
import App from './services/ExpressApp'
import dbCOnnection from './services/Database';

const startServer = async() => {
    const app = express()

    await dbCOnnection()

    await App(app)

    app.listen(8000, () => {
        console.log('Listening on port 8000');
    });
}

startServer();