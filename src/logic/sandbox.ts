import { Blockchain } from "@ton-community/sandbox";

export default class BlockchainLogic {
  static chains: Map<string, Blockchain> = new Map();
  static launch = (id: string): Blockchain => {};
  static shutdown = (id: string, remove: boolean = false): boolean => {};
  static list = (): Array<string> => {};
}
