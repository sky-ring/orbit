import { Address, Cell, Message, StateInit } from "ton-core";

export function internal(params: {
  from: Address;
  to: Address;
  value: bigint;
  body?: Cell;
  stateInit?: StateInit;
  bounce?: boolean;
  bounced?: boolean;
  ihrDisabled?: boolean;
  ihrFee?: bigint;
  forwardFee?: bigint;
  createdAt?: number;
  createdLt?: bigint;
}): Message {
  return {
    info: {
      type: "internal",
      dest: params.to,
      src: params.from,
      value: { coins: params.value },
      bounce: params.bounce ?? true,
      ihrDisabled: params.ihrDisabled ?? true,
      bounced: params.bounced ?? false,
      ihrFee: params.ihrFee ?? 0n,
      forwardFee: params.forwardFee ?? 0n,
      createdAt: params.createdAt ?? 0,
      createdLt: params.createdLt ?? 0n,
    },
    body: params.body ?? new Cell(),
    init: params.stateInit,
  };
}

export function external(params: {
  to: Address;
  body?: Cell;
  stateInit?: StateInit;
}): Message {
  return {
    info: {
      type: "external-in",
      dest: params.to,
      importFee: 0n,
    },
    body: params.body ?? new Cell(),
    init: params.stateInit,
  };
}
