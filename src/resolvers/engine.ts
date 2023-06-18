import { Blockchain } from "@ton-community/sandbox";
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
      let b = BlockchainLogic.launch(id);
      return b != null;
    },
    bringDown: async (_, { params }, {}): Promise<boolean> => {
      let { id, remove } = params;
      remove = !!remove;
      return BlockchainLogic.shutdown(id, remove);
    },
  });
};
