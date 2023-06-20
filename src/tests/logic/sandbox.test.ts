import { assert, expect } from "chai";
import BlockchainLogic from "../../logic/sandbox";
import { ONE_TON } from "../../util/consts";
import { internal } from "../../util/message";
import { Address, Builder, Cell, address, storeMessage } from "ton";

describe("sandbox-logic", () => {
  it("should create and remove blockchain", async () => {
    let blkch = await BlockchainLogic.launch("test-1");
    let c = await blkch.createWallets(1, {
      workchain: 0,
      predeploy: true,
      balance: ONE_TON,
    });
    expect(await c[0].getBalance()).eq(ONE_TON);
  }).timeout(0);
  it("should create and send message", async () => {
    let blkch = await BlockchainLogic.launch("test-1");
    let alice = await blkch.treasury("alice", { balance: ONE_TON });
    let bob = await blkch.treasury("bob", { balance: ONE_TON });
    let msg = internal({
      from: alice.address,
      to: bob.address,
      value: (ONE_TON / 10n) * 8n,
      bounce: true,
    });
    let b = new Builder();
    storeMessage(msg)(b);
    let c = b.asCell();
    let r = await BlockchainLogic.sendMessage(
      "test-1",
      c.toBoc({ idx: true, crc32: true }).toString("base64")
    );
    assert(r.length != 0);
    console.log(r);
    let ab = await alice.getBalance();
    let bb = await bob.getBalance();
    assert(ab == ONE_TON); // since we sent the message not from alice's contract, it's balance is untouched
    assert(bb > ONE_TON);
  }).timeout(0);
});
