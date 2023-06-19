import { Blockchain, BlockchainSnapshot } from "@ton-community/sandbox";
import { db } from "./db";
import { Cell } from "ton";

export type Config = {
  snapshots: Array<string>;
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
  static sendMessage = async (id: string, boc64: string): Promise<boolean> => {
    let blkch = this.chains.get(id);
    let cell = Cell.fromBase64(boc64);
    let result = await blkch?.sendMessage(cell);
    return true;
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
      await db.del(`${id}-tx`);
    }
    return x;
  };
  static list = async (): Promise<Array<string>> => {
    return (await this.cfg()).snapshots ?? [];
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
