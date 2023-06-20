import { Blockchain, BlockchainSnapshot } from "@ton-community/sandbox";
import { db } from "./db";
import { Address, Cell } from "ton";
import { txBytes, txHash } from "../util/tx";
import { AccountInfo } from "../resolvers/resolvers";

export type Config = {
  snapshots: Array<string>;
};

export type BlockchainTxes = {
  txList: Array<string>;
};

export default class BlockchainLogic {
  private static chains: Map<string, Blockchain> = new Map();
  private static config?: Config;
  private static defaultConfig: Config = {
    snapshots: [],
  };
  static launch = async (id: string): Promise<Blockchain> => {
    let list = await this.list();
    let blkch = await Blockchain.create();
    if (list.includes(id)) {
      // We have a snapshot here, better load it
      let snapshot = await db.get<BlockchainSnapshot>(`${id}-snapshot`);
      blkch.loadFrom(snapshot!);
    }
    (await this.cfg()).snapshots.push(id);
    await this.reload();
    this.chains.set(id, blkch);
    return blkch;
  };
  static sendMessage = async (
    id: string,
    boc64: string
  ): Promise<Array<string>> => {
    let blkch = this.chains.get(id);
    let cell = Cell.fromBase64(boc64);
    let result = await blkch?.sendMessage(cell);
    let hashes = [];

    for await (const tx of result?.transactions!) {
      // TODO: Batch Insert
      let hash = txHash(tx).toString(16);
      let data = txBytes(tx);
      await db.setBytes(`${id}-tx-${hash}`, data);
      let txes = (await db.get<BlockchainTxes>(`${id}-tx`)) ?? {
        txList: [],
      };
      txes.txList.push(hash);
      await db.set<BlockchainTxes>(`${id}-tx`, txes);
      hashes.push(hash);
    }

    return hashes;
  };
  static shutdown = async (
    id: string,
    remove: boolean = false
  ): Promise<boolean> => {
    if (!this.chains.has(id)) return false;
    let x = this.chains.delete(id);
    if (x && remove) {
      let cfg = await this.cfg();
      cfg.snapshots = cfg.snapshots.filter((item) => item !== id);
      await this.reload();
      await db.del(`${id}-snapshot`);
      let txes = await db.pop<BlockchainTxes>(`${id}-tx`);
      for await (const tx of txes?.txList!) {
        await db.del(`${id}-tx-${tx}`);
      }
    }
    return x;
  };
  static list = async (): Promise<Array<string>> => {
    return (await this.cfg()).snapshots ?? [];
  };
  static getAccount = async (
    id: string,
    account: string
  ): Promise<AccountInfo> => {
    let blkch = this.chains.get(id);
    let cnt = await blkch?.getContract(Address.parse(account));
    let state = cnt?.accountState!;
    if (state.type == "active") {
      let code = state.state.code;
      let data = state.state.data;
      let balance = cnt?.balance;
      return {
        code: code?.toBoc().toString("base64"),
        data: data?.toBoc().toString("base64"),
        balance: balance?.toString(),
      };
    }
    return {};
  };
  static createWallet = async (
    id: string,
    account: string,
    balance: bigint
  ): Promise<Address> => {
    let blkch = this.chains.get(id);
    let cnt = await blkch?.treasury(account, { balance });
    return cnt?.address!;
  };
  private static cfg = async (): Promise<Config> => {
    if (!this.config) {
      let e = (await db.get<Config>("config")) ?? this.defaultConfig;
      this.config = e;
    }
    return this.config;
  };
  private static reload = async (): Promise<boolean> => {
    await db.set("config", await this.cfg());
    return true;
  };
}
