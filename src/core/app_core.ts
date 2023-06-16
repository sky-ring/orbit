import {addResolversToSchema} from "@graphql-tools/schema";
import {loadResolvers} from "./resolvers";
import {createYoga, YogaServerInstance} from "graphql-yoga";
import contextLoader, { ContextType } from "./context";
import {loadSchemas} from "./schema";
import {Application} from "express";
import express from "express";
import {createServer, Server as NServer, IncomingMessage, ServerResponse} from "node:http";

export type Server = YogaServerInstance<any, ContextType>;

export default class AppCore {
    yoga: Server | undefined;
    app: Application | undefined;
    server: NServer<typeof IncomingMessage, typeof ServerResponse> | undefined;
    initServer = () => {
        let schema = addResolversToSchema({
            schema: loadSchemas(),
            resolvers: loadResolvers()
        });

        this.yoga = createYoga({
            schema: schema as any,
            context: contextLoader
        });

        this.app = express();
        this.app.use(this.yoga?.graphqlEndpoint, this.yoga!);
        this.server = createServer(this.app);
    };
    express = (): Application => {
        return this.app!;
    };
    start = (port: number = 4000, cb: () => void) => {
        this.server?.listen(port, cb);
    }
}