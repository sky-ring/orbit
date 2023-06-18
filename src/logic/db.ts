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
  static get = async (key: string): Promise<Entry | undefined> => {
    let a = await this.acquire().get(key);
    return a;
  };
  static set = async (key: string, value: Entry): Promise<void> => {
    await this.acquire().put(key, value);
  };
}

export let db = DatabaseLogic;
