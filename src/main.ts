import AppCore from "./core/app_core";
import { initResolvers } from "./resolvers";

let app = new AppCore();
initResolvers();
app.initServer();
app.start(3022, () => console.log("server launched!"));
