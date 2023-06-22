import {
  Address,
  Builder,
  Cell,
  StateInit,
  storeMessage,
  storeStateInit,
} from "ton";
import { external } from "../../util/message";
import { sign } from "ton-crypto";

export let stateInit = (code: Cell, pub: Buffer): StateInit => {
  let b = new Builder();
  b.storeUint(0, 32);
  b.storeUint(0, 32);
  b.storeBuffer(pub, 32);
  let data = b.asCell();
  return {
    code,
    data,
  };
};

export let stateInitCell = (code: Cell, pub: Buffer): Cell => {
  let b = new Builder();
  b.storeUint(0, 32);
  b.storeUint(0, 32);
  b.storeBuffer(pub, 32);
  let data = b.asCell();
  let s = {
    code,
    data,
  };
  let bc = new Builder();
  storeStateInit(s)(bc);
  return bc.asCell();
};

export let walletAddress = (code: string, pub: Buffer): Address => {
  let codeC = Cell.fromBase64(code);
  let h = stateInitCell(codeC, pub).hash();
  return new Address(0, h);
};

export let deployContract = (
  addr: Address,
  code: string,
  pub: Buffer,
  body: Cell
): Cell => {
  let codeC = Cell.fromBase64(code);
  let init = stateInit(codeC, pub);
  let msg = external({
    stateInit: init,
    body,
    to: addr,
  });
  let b = new Builder();
  storeMessage(msg)(b);
  return b.asCell();
};

export let initialMessageW3R2 = (priv: Buffer): Cell => {
  let b = new Builder();
  b.storeUint(0, 32);
  b.storeUint(0xffffffff - 1, 32);
  b.storeUint(0, 32);
  let data = b.endCell();
  let sig = sign(data.hash(), priv);
  let nb = new Builder();
  nb.storeBuffer(sig, 64);
  nb.storeSlice(data.asSlice());
  return nb.endCell();
};
