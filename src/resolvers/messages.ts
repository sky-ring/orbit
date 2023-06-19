import { TypeResolver } from "./index";
import BlockchainLogic from "../logic/sandbox";

export let messagesResolver = () => {
  TypeResolver.appendQuery({});

  TypeResolver.appendMutation({
    sendBoc: async (_, { id, boc64 }, {}): Promise<Array<string>> => {
      return await BlockchainLogic.sendMessage(id, boc64);
    },
  });
};
