import { Level } from "level";
import PathLogic from "./path";

export type Entry = { [key: string]: any };
export type DB = Level<string, Entry>;
export default class DatabaseLogic {
  private static instance?: DB;
  static acquire = (): DB => {
    if (this.instance == undefined) {
      let pt = PathLogic.ensureDataDir("Orbit", "Nebulae", "level-db");
      this.instance = new Level(pt, {
        keyEncoding: "utf8",
        valueEncoding: "json",
      });
    }
    return this.instance;
  };
  static get = async <T extends Entry>(key: string): Promise<T | undefined> => {
    try {
      let a = (await this.acquire().get(key)) as T;
      return a;
    } catch (error: any) {
      if (error.status == 404) return undefined;
    }
  };
  static del = async (key: string): Promise<boolean> => {
    return await this.acquire()
      .del(key)
      .then(() => true)
      .catch((e) => false);
  };
  static set = async <T extends Entry>(
    key: string,
    value: T
  ): Promise<void> => {
    await this.acquire().put(key, value);
  };
}

export let db = DatabaseLogic;
