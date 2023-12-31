import { Blockchain, BlockchainTransaction } from "@ton-community/sandbox";
import { db } from "./db";
import { Address, Builder, Cell, storeMessage } from "ton";
import { txBytes, txHash } from "../util/tx";
import { AccountInfo } from "../resolvers/resolvers";
import {
  deserializeBlockchain,
  serializeBlockchain,
} from "../sandbox/serialize";
import { internal } from "../util/message";

export type Config = {
  snapshots: Array<string>;
};

export type BlockchainTxes = {
  txList: Array<string>;
};

export type OrbitTx = BlockchainTransaction & { hash: string };

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
      await this.retain(id, blkch);
    }
    (await this.cfg()).snapshots.push(id);
    await this.reload();
    this.chains.set(id, blkch);
    return blkch;
  };
  static sendMessage = async (
    id: string,
    boc64: string
  ): Promise<Array<OrbitTx>> => {
    let blkch = await this.ensureOpen(id);
    let cell = Cell.fromBase64(boc64);
    let result = await blkch?.sendMessage(cell);
    let txResult: Array<OrbitTx> = [];

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
      txResult.push({
        hash,
        ...tx,
      });
    }
    await this.persist(id);
    return txResult;
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
      if (txes) {
        for await (const tx of txes?.txList!) {
          await db.del(`${id}-tx-${tx}`);
        }
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
    let blkch = await this.ensureOpen(id);
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
    } else if (state.type == "uninit") {
      let balance = cnt?.balance;
      if (balance) return { balance: balance.toString() };
    }
    return {};
  };
  static chargeAccount = async (
    id: string,
    account: string,
    value: bigint
  ): Promise<boolean> => {
    let zero = new Address(0, Buffer.alloc(32, 0));
    let msg = internal({
      from: zero,
      to: Address.parse(account),
      value: value,
      bounce: false, // Make it unbouncable so we get that money locked
    });
    let b = new Builder();
    storeMessage(msg)(b);
    let c = b.asCell();
    let r = await this.sendMessage(id, c.toBoc().toString("base64"));
    return r.length == 1;
  };
  static createWallet = async (
    id: string,
    account: string,
    balance: bigint
  ): Promise<Address> => {
    let blkch = await this.ensureOpen(id);
    let cnt = await blkch?.treasury(account, { balance });
    await this.persist(id);
    return cnt?.address!;
  };
  private static ensureOpen = async (id: string): Promise<Blockchain> => {
    if (this.chains.has(id)) return this.chains.get(id)!;
    return await this.launch(id);
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
  private static retain = async (
    id: string,
    blkch: Blockchain
  ): Promise<boolean> => {
    let buf = await db.getBytes(`${id}-snapshot`);
    if (buf) {
      let snap = deserializeBlockchain(buf);
      await blkch?.loadFrom(snap);
      return true;
    }
    return false;
  };
  private static persist = async (id: string): Promise<boolean> => {
    let blkch = this.chains.get(id);
    let buf = serializeBlockchain(blkch!);
    await db.setBytes(`${id}-snapshot`, buf);
    return true;
  };
}
