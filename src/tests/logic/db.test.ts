import { expect } from "chai";
import { db } from "../../logic/db";

describe("db-logic", () => {
  it("should get and set without problem", async () => {
    await db.set("a", { alpha: 1 });
    let a = await db.get("a");
    expect(a!.alpha).eq(1);
  }).timeout(0);
  it("should get and set bytes without problem", async () => {
    let buf = Buffer.alloc(10, "T");
    await db.setBytes("a", buf);
    let a = await db.getBytes("a");
    expect(a?.compare(buf)).eq(0);
  }).timeout(0);
});
