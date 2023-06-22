import { assert } from "chai";
import AppCore from "../../core/app_core";
import { initResolvers } from "../../resolvers";
import { keyPairFromSeed } from "ton-crypto";
import { execute } from "../util/yoga";
import { deployContract, walletAddress, initialMessageW3R2 } from "../util/ton";

describe("wallet-test-resolver", () => {
  it("should deploy wallets and transact", async () => {
    let app = new AppCore();
    initResolvers();
    app.initServer();

    let result: any = await execute(
      app.yoga,
      `
        mutation {
          spawn(id: "test-x")
        }
      `
    );
    assert(result.data?.spawn);

    let walletCode =
      "te6cckEBAQEAcQAA3v8AIN0gggFMl7ohggEznLqxn3Gw7UTQ0x/THzHXC//jBOCk8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVBC9ba0=";
    let aliceKeys = keyPairFromSeed(Buffer.alloc(32, 1));
    let bobKeys = keyPairFromSeed(Buffer.alloc(32, 2));

    let alice = walletAddress(walletCode, aliceKeys.publicKey);
    let bob = walletAddress(walletCode, bobKeys.publicKey);

    result = await execute(
      app.yoga,
      `
          mutation {
            ar: charge(id: "test-x", address: "${alice.toString()}", value: "10ton")
            br: charge(id: "test-x", address: "${bob.toString()}", value: "10ton")
          }
        `
    );
    assert(result.data?.ar);
    assert(result.data?.br);

    let initialAlice = initialMessageW3R2(aliceKeys.secretKey);
    let deployAlice = deployContract(
      alice,
      walletCode,
      aliceKeys.publicKey,
      initialAlice
    );

    let initialBob = initialMessageW3R2(bobKeys.secretKey);
    let deployBob = deployContract(
      bob,
      walletCode,
      bobKeys.publicKey,
      initialBob
    );
    result = await execute(
      app.yoga,
      `
        mutation {
            as: sendBoc(id: "test-x", boc64: "${deployAlice
              .toBoc()
              .toString("base64")}")
            bs: sendBoc(id: "test-x", boc64: "${deployBob
              .toBoc()
              .toString("base64")}")
        }
          `
    );
    assert(result.data?.as);
    assert(result.data?.bs);

    result = await execute(
      app.yoga,
      `
          query {
              ab: account(id: "test-x", address: "${alice.toString()}") {
                balance
              }
              bb: account(id: "test-x", address: "${bob.toString()}") {
                balance
              }
          }
            `
    );

    assert(result.data?.ab.balance == "9995240000");
    assert(result.data?.bb.balance == "9995240000");

    result = await execute(
      app.yoga,
      `
          mutation {
            bringDown(params: { id: "test-x", remove: true })
          }
        `
    );
    assert(result.data?.bringDown);
  }).timeout(0);
});
