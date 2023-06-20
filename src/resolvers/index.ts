import Resolvers, { setResolvers } from "../core/resolvers";
import {
  Resolvers as IResolvers,
  MutationResolvers,
  QueryResolvers,
} from "./resolvers";
import { ContextType } from "../core/context";
import { versionResolver } from "./version";
import { engineResolver } from "./engine";
import { messagesResolver } from "./messages";
import { accountResolver } from "./account";

export let TypeResolver = new Resolvers<
  IResolvers<ContextType>,
  QueryResolvers<ContextType>,
  MutationResolvers<ContextType>
>();

export let initResolvers = () => {
  setResolvers(TypeResolver);
  versionResolver();
  engineResolver();
  messagesResolver();
  accountResolver();
};
