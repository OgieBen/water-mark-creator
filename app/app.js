import express from 'express';
import rootSchema from './data/schema/rootSchema';
import graphqlHttp from 'express-graphql';
import apiRouter from './routes/index'

const app = express();

app.use('/api/v1', apiRouter);

app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - The page you are looking for does not exist');
});

app.use(function (err, req, res, next) {
    res.type('text/plain');
    res.status(500);
    res.send('500 - Internal Server Error');
});

export default app;