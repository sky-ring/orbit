import { Entry } from "../../logic/db";

export let execute = async (yoga: any, query: string): Promise<Entry> => {
  let response = await yoga.fetch("http://yoga/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
    }),
  });
  if (response.status != 200) {
    throw Error("Response status should be 200");
  }
  let executionResult = await response.json();
  return executionResult;
};
