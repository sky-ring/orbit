import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import PathLogic from "../logic/path";
import { join } from "path";

export let loadSchemas = () => {
  return loadSchemaSync(join(PathLogic.mainDir, "gql/*.graphql"), {
    loaders: [new GraphQLFileLoader()],
  });
};
