import {
  Blockchain,
  BlockchainSnapshot,
  SmartContractSnapshot,
} from "@ton-community/sandbox";
import { Entry } from "../logic/db";
import {
  Address,
  Builder,
  Cell,
  loadShardAccount,
  storeShardAccount,
} from "ton";
import { deserialize, serialize } from "v8";

export let storeSmartContractSnapshot = (
  snap: SmartContractSnapshot
): Entry => {
  let b = new Builder();
  storeShardAccount(snap.account)(b);
  let account = b.asCell().toBoc().toString("base64");
  return {
    account,
    address: snap.address.toString(),
    lastTxTime: snap.lastTxTime,
    verbosity: snap.verbosity,
  };
};

export let loadSmartContractSnapshot = (snap: Entry): SmartContractSnapshot => {
  let accountS = Cell.fromBase64(snap.account).beginParse();
  return {
    account: loadShardAccount(accountS),
    address: Address.parse(snap.address),
    lastTxTime: snap.lastTxTime,
    verbosity: snap.verbosity,
  };
};

export let storeBlockchainSnapshot = (snap: BlockchainSnapshot): Entry => {
  let contracts = snap.contracts.map(storeSmartContractSnapshot);
  return {
    contracts,
    libs: snap.libs?.toBoc().toString("base64"),
    lt: snap.lt.toString(),
    networkConfig: snap.networkConfig,
    nextCreateWalletIndex: snap.nextCreateWalletIndex,
    time: snap.time,
    verbosity: snap.verbosity,
  };
};

export let loadBlockchainSnapshot = (snap: Entry): BlockchainSnapshot => {
  let contracts = (snap.contracts as Array<Entry>).map(
    loadSmartContractSnapshot
  );
  let libs = snap.libs;
  if (libs) {
    libs = Cell.fromBase64(libs);
  }
  return {
    contracts,
    libs,
    lt: BigInt(snap.lt),
    networkConfig: snap.networkConfig,
    nextCreateWalletIndex: snap.nextCreateWalletIndex,
    time: snap.time,
    verbosity: snap.verbosity,
  };
};

export let serializeBlockchain = (b: Blockchain): Buffer => {
  let snap = b.snapshot();
  let e = storeBlockchainSnapshot(snap);
  return serialize(e);
};

export let deserializeBlockchain = (b: Buffer): BlockchainSnapshot => {
  let e: Entry = deserialize(b);
  let snap = loadBlockchainSnapshot(e);
  return snap;
};
