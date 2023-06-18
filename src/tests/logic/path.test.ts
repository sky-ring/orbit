import PathLogic from "../../logic/path";

describe("path-logic", () => {
  it("should work without problem", async () => {
    let pt = PathLogic.userDataDir("Orbit", "Nebulae");
    console.log(pt);
  }).timeout(0);
});
