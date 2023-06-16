import {loadSchemaSync} from "@graphql-tools/load";
import {GraphQLFileLoader} from "@graphql-tools/graphql-file-loader";

export let loadSchemas = () => {
    return loadSchemaSync('gql/*.graphql', {
        loaders: [
            new GraphQLFileLoader()
        ]
    });
};