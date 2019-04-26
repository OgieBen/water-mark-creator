import express from 'express';
import rootSchema from './data/schema/rootSchema';
import  graphqlHttp  from 'express-graphql';
import indexRoute from './routes/index'


const app = express();

app.use('/', indexRoute);

app.use('/graphql', graphqlHttp({schema: rootSchema, graphiql: true}));

export default app;