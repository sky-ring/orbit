import { Level } from "level";
import PathLogic from "./path";

export type Entry = { [key: string]: any };
export type DB = Level<string, Entry>;
export default class DatabaseLogic {
  private static instance?: DB;
  static acquire = async (): Promise<DB> => {
    if (this.instance == undefined) {
      let pt = PathLogic.ensureDataDir("Orbit", "Nebulae", "level-db");
      this.instance = new Level(pt, {
        keyEncoding: "utf8",
        valueEncoding: "json",
      });
      await this.instance.open();
    }
    return this.instance;
  };
  static get = async <T extends Entry>(key: string): Promise<T | undefined> => {
    try {
      let db_ = await this.acquire();
      let a = (await db_.get(key)) as T;
      return a;
    } catch (error: any) {
      if (error.status == 404) return undefined;
    }
  };
  static getBytes = async (key: string): Promise<Buffer | undefined> => {
    try {
      let db_ = await this.acquire();
      let a = await db_.get(key, {
        valueEncoding: "buffer",
      });
      return a as Buffer;
    } catch (error: any) {
      if (error.status == 404) return undefined;
    }
  };
  static pop = async <T extends Entry>(key: string): Promise<T | undefined> => {
    let t = await this.get<T>(key);
    let ok = await this.del(key);
    if (!ok) throw Error("Error deleting the key!");
    return t;
  };
  static del = async (key: string): Promise<boolean> => {
    let db_ = await this.acquire();
    return await db_
      .del(key)
      .then(() => true)
      .catch((e) => false);
  };
  static set = async <T extends Entry>(
    key: string,
    value: T
  ): Promise<void> => {
    let db_ = await this.acquire();
    await db_.put(key, value);
  };
  static setBytes = async (key: string, value: Buffer): Promise<void> => {
    let db_ = await this.acquire();
    await db_.put(key, value, {
      valueEncoding: "buffer",
    });
  };
}

export let db = DatabaseLogic;
