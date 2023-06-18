import { expect } from "chai";
import BlockchainLogic from "../../logic/sandbox";

describe("sandbox-logic", () => {
  it("should create and remove blockchain", async () => {
    let blkch = await BlockchainLogic.launch("test-1");
    let c = await blkch.createWallets(1, {
      workchain: 0,
      predeploy: true,
      balance: 10000000000n,
    });
    expect(await c[0].getBalance()).eq(10000000000n);
  }).timeout(0);
});
