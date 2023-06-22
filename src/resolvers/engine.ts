import { TypeResolver } from "./index";
import BlockchainLogic from "../logic/sandbox";

export let engineResolver = () => {
  TypeResolver.appendQuery({
    snapshots: async (_, {}, {}): Promise<string[]> => {
      return BlockchainLogic.list();
    },
  });

  TypeResolver.appendMutation({
    spawn: async (_, { id }, {}): Promise<boolean> => {
      let b = await BlockchainLogic.launch(id);
      return b != null;
    },
    bringDown: async (_, { params }, {}): Promise<boolean> => {
      let { id, remove } = params;
      remove = !!remove;
      return await BlockchainLogic.shutdown(id, remove);
    },
  });
};
