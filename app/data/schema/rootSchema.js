import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLString,
    GraphQLSchema
} from 'graphql';
import ObjectInterface from '../interfaces/ObjectInterface';

let inMemoryDataStore = {};

const topQuery = new GraphQLObjectType({
    name: "TopQuery",
    description: "A simple demonstration of query",
    
    fields: {
        node: {
            type: ObjectInterface,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID)
                },
            },

            resolve(source, args) {
                return inMemoryDataStore[args.key];
            }

        }
    }
});

const topMutation = new GraphQLObjectType({
    name: 'TopMutation',
    description: 'A demonstration of mutation',
    fields: {
        setNode: {
            type: GraphQLString,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID)
                },
                value: {
                    type: new GraphQLNonNull(GraphQLString),
                }
            },

            resolve(source, args) {
                inMemoryDataStore[args.key] = args.value;
                return inMemoryDataStore[args.key]
            }
        }
    }
});


let schema = new GraphQLSchema({
    query: topQuery,
    mutation: topMutation,
});

export default schema