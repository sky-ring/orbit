import AppCore from "./core/app_core";
import { initResolvers } from "./resolvers";

let app = new AppCore();
initResolvers();
app.initServer();
app.start(24194, () => console.log("server launched!"));
