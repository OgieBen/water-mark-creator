import express from 'express';
import rootSchema from './data/schema/rootSchema';
import  graphqlHttp  from 'express-graphql';
import indexRouter from './routes/index'


const app = express();

app.use('/', indexRouter);

app.use('/graphql', graphqlHttp({schema: rootSchema, graphiql: true}));

export default app;