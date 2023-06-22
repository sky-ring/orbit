#!/usr/bin/env node

import AppCore from "./core/app_core";
import PathLogic from "./logic/path";
import { initResolvers } from "./resolvers";

PathLogic.mainDir = __dirname;
let app = new AppCore();
initResolvers();
app.initServer();
app.start(24194, () => console.log("server launched!"));
