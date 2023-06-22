import { assert } from "chai";
import AppCore from "../../core/app_core";
import { initResolvers } from "../../resolvers";
import { keyPairFromSeed } from "ton-crypto";
import { execute } from "../util/yoga";
import {
  deployContract,
  walletAddress,
  initialMessageW3R2,
  transferMessageW3R2,
  externalSend,
} from "../util/ton";

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
    result = await execute(
      app.yoga,
      `
            mutation {
              bringDown(params: { id: "test-x", remove: true })
            }
          `
    );
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
              .toString("base64")}") {
                hash
                info{
                    fee
                }
              }
            bs: sendBoc(id: "test-x", boc64: "${deployBob
              .toBoc()
              .toString("base64")}") {
                hash
                info{
                    fee
                }
              }
        }
          `
    );
    assert(result.data?.as);
    assert(result.data?.bs);
    let af = BigInt(result.data?.as[0].info.fee);
    let bf = BigInt(result.data?.bs[0].info.fee);

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

    let initialB = BigInt("10000000000");
    let aliceBalance = BigInt(result.data?.ab.balance);
    let bobBalance = BigInt(result.data?.bb.balance);
    assert(aliceBalance === initialB - af);
    assert(bobBalance === initialB - bf);

    // let's say alice transfers 2 ton to bob
    let tMsg = transferMessageW3R2(
      aliceKeys.secretKey,
      alice,
      bob,
      2000000000n,
      1
    );
    let boc = externalSend(alice, tMsg).toBoc().toString("base64");
    result = await execute(
      app.yoga,
      `
          mutation {
              sendBoc(id: "test-x", boc64: "${boc}") {
                  hash
                  info{
                      fee
                  }
                }
          }
            `
    );
    assert(result.data.sendBoc[0].hash);
    assert(result.data.sendBoc[1].hash);
    let aliceSendFee = BigInt(result.data.sendBoc[0].info.fee);
    let bobReceiveFee = BigInt(result.data.sendBoc[1].info.fee);
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

    let aliceBalanceOld = aliceBalance;
    let bobBalanceOld = bobBalance;
    aliceBalance = BigInt(result.data?.ab.balance);
    bobBalance = BigInt(result.data?.bb.balance);
    let aliceDiff =
      aliceBalance - (aliceBalanceOld - 2000000000n - aliceSendFee);
    let bobDiff = bobBalance - (bobBalanceOld + 2000000000n - bobReceiveFee);
    assert(aliceDiff < 1500000n);
    assert(bobDiff < 1500000n);

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
