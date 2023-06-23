# Orbit

Orbit is a wrapper GraphQL server around `@ton-community/sandbox` that provides a mini TON Blockchain Server. It's purpose is to provide an easy to launch Blockchain environment (like `testnet`) so projects can be easily and thoroughly tested before deploying to `mainnet`. Rift framework will utilize Orbit to provide multi-contract testing framework for TON development.

### Why not use Sandbox itself?

The reason behind not using sandbox directly, is that sandbox doesn't provide direct persistance of Blockchain state and transactions and is specially developed for `node.js` environments. Orbit comes as a complimentary tool to provide these enhancements. Being a local server provides the benefit of privacy and most flexibility before initial launch of the project to `testnet` or `mainnet`.

### What's Next?

As of now Orbit provides a GraphQL server to make calls, but we will support `ton-api-v4` so the changes in the code can be minimized.

## GraphQL Definitions

Here are the GraphQL definition for `Query` and `Mutation` with slight descriptions:

```graphql
type Mutation {
  spawn(id: String!): Boolean # launches blockchain instance with id
  sendBoc(id: String!, boc64: String!): [Tx] # sends a boc message to specified network
  bringDown(params: BringDownInput!): Boolean # shutdowns blockchain instance with remove capabilty
  createWallet(id: String!, walletId: String!, balance: String!): String # create a wallet with name on the network with specified balance
  charge(id: String!, address: String!, value: String!): Boolean # top-ups balance for specified account on the network
}

type Query {
  version: Version # Version of the orbit
  snapshots: [String] # List of stored snapshots of blockchains
  account(id: String!, address: String!): AccountInfo # Account information
}
```
