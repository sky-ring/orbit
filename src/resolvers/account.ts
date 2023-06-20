import { TypeResolver } from "./index";
import BlockchainLogic from "../logic/sandbox";
import { AccountInfo } from "./resolvers";

export let accountResolver = () => {
  TypeResolver.appendQuery({
    account: async (_, { id, address }, {}): Promise<AccountInfo> => {
      let account = await BlockchainLogic.getAccount(id, address);
      return account;
    },
  });

  TypeResolver.appendMutation({
    createWallet: async (_, { id, walletId, balance }, {}): Promise<string> => {
      if (balance.endsWith("ton")) {
        balance = balance.replace("ton", "000000000");
      }
      let bn = BigInt(balance);
      let addr = await BlockchainLogic.createWallet(id, walletId, bn);
      return addr.toString();
    },
    charge: async (_, { id, address, value }, {}): Promise<boolean> => {
      if (value.endsWith("ton")) {
        value = value.replace("ton", "000000000");
      }
      let bn = BigInt(value);
      return await BlockchainLogic.chargeAccount(id, address, bn);
    },
  });
};
