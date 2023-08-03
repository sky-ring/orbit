<img align="left" width="64" height="64" src="https://github.com/sky-ring/orbit/blob/main/assets/orbit.png">

# Orbit

[![PyPI version](https://img.shields.io/badge/@sky-ring/orbit-0.1.2-informational?style=flat-square&color=FFFF91&labelColor=360825)](https://www.npmjs.com/package/@sky-ring/orbit)

Orbit is a GraphQL server wrapper around `@ton-community/sandbox`, designed to provide a mini TON Blockchain Server. Its purpose is to offer an easily launchable Blockchain environment (similar to `testnet`) for seamless and thorough project testing before deploying to `mainnet`. The Rift framework will leverage Orbit to provide a multi-contract testing framework for TON development.

### Why Use Orbit?

While Sandbox itself is a valuable tool, it lacks direct persistence of Blockchain state and transactions, and is primarily tailored for `node.js` environments. Orbit serves as a complementary tool, addressing these limitations by providing enhanced functionalities. As a local server, it ensures privacy and offers maximum flexibility before the project's initial launch on `testnet` or `mainnet`.

### What's Next?

Currently, Orbit provides a GraphQL server for making calls. We have plans to support `ton-api-v4`, which will minimize code changes required during integration.

## How to Use

To get started with Orbit, follow these steps:

1. Ensure you have a node environment set up.
2. Install Orbit globally by running the following command:

   ```bash
   npm install -g @sky-ring/orbit
   ```

3. Open up a terminal and type:

   ```bash
   orbit
   ```

If everything is okay, you will see a successful launch message.

4. You can now send GraphQL queries to `localhost:29194` or navigate to the GraphiQL page at `localhost:29194/graphql`.

## GraphQL Definitions

Here are the GraphQL definitions for `Query` and `Mutation` along with brief descriptions:

```graphql
type Mutation {
  spawn(id: String!): Boolean # Launches a blockchain instance with the specified ID
  sendBoc(id: String!, boc64: String!): [Tx] # Sends a BOC message to the specified network
  bringDown(params: BringDownInput!): Boolean # Shuts down a blockchain instance with removal capability
  createWallet(id: String!, walletId: String!, balance: String!): String # Creates a wallet with the specified name on the network with the given balance
  charge(id: String!, address: String!, value: String!): Boolean # Tops up the balance for the specified account on the network
}

type Query {
  version: Version # Retrieves the version of Orbit
  snapshots: [String] # Retrieves the list of stored snapshots of blockchains
  account(id: String!, address: String!): AccountInfo # Retrieves account information for the specified ID and address
}
```

Feel free to explore and utilize these GraphQL endpoints to interact with the Orbit server.
