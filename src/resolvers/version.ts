import {TypeResolver} from "./index";
import {Version} from "./resolvers";

export let versionResolver = () => {
    TypeResolver.appendQuery({
        version:async (_, {}, {}): Promise<Version> => {
            return {
                major: 0,
                minor: 1,
                patch: 0,
            }
        }
    });

    TypeResolver.appendMutation({
        dummy: async (_, {}, {}): Promise<number> => {
            return 0;
        },
    })
};