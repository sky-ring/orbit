import { TypeResolver } from "./index";
import BlockchainLogic from "../logic/sandbox";

export let messagesResolver = () => {
  TypeResolver.appendQuery({});

  TypeResolver.appendMutation({
    sendBoc: async (_, { id, boc64 }, {}): Promise<boolean> => {
      return await BlockchainLogic.sendMessage(id, boc64);
    },
  });
};
