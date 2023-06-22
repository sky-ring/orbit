import { TypeResolver } from "./index";
import BlockchainLogic from "../logic/sandbox";
import { Tx } from "./resolvers";

export let messagesResolver = () => {
  TypeResolver.appendQuery({});

  TypeResolver.appendMutation({
    sendBoc: async (_, { id, boc64 }, {}): Promise<Array<Tx>> => {
      let r = await BlockchainLogic.sendMessage(id, boc64);
      return r.map((tx) => ({
        hash: tx.hash,
        info: {
          fee: tx.totalFees.coins.toString(),
        },
      }));
    },
  });
};
