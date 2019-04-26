import  { GraphQLInterfaceType, GraphQLNonNull, GraphQLID } from 'graphql';
import { Repo } from '../repo/Repo'

let repo = new Repo();

let ObjectInterface = new GraphQLInterfaceType({
    name: "ObjectInterface",
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },

        // source: current data
        // resolveType(source){
        //     repo.handleTypeResolver(source);
        // }
    }
});


export default ObjectInterface;