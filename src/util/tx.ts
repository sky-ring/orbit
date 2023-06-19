import { BlockchainTransaction } from "@ton-community/sandbox";
import { Builder, Transaction, storeTransaction } from "ton";

export let txHash = (tx: Transaction | BlockchainTransaction): bigint => {
  let b = new Builder();
  storeTransaction(tx as Transaction)(b);
  let hash = b.asCell().hash();
  b = new Builder();
  b.storeBuffer(hash);
  let hash_num = b.asSlice().loadUintBig(256);
  return hash_num;
};

export let txBytes = (tx: Transaction | BlockchainTransaction): Buffer => {
  let b = new Builder();
  storeTransaction(tx as Transaction)(b);
  return b.asCell().toBoc();
};
