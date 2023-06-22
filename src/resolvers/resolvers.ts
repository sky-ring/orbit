import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type AccountInfo = {
  __typename?: 'AccountInfo';
  balance?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['String']['output']>;
};

export type BringDownInput = {
  id: Scalars['String']['input'];
  remove?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  bringDown?: Maybe<Scalars['Boolean']['output']>;
  charge?: Maybe<Scalars['Boolean']['output']>;
  createWallet?: Maybe<Scalars['String']['output']>;
  sendBoc?: Maybe<Array<Maybe<Tx>>>;
  spawn?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationBringDownArgs = {
  params: BringDownInput;
};


export type MutationChargeArgs = {
  address: Scalars['String']['input'];
  id: Scalars['String']['input'];
  value: Scalars['String']['input'];
};


export type MutationCreateWalletArgs = {
  balance: Scalars['String']['input'];
  id: Scalars['String']['input'];
  walletId: Scalars['String']['input'];
};


export type MutationSendBocArgs = {
  boc64: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationSpawnArgs = {
  id: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<AccountInfo>;
  snapshots?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  version?: Maybe<Version>;
};


export type QueryAccountArgs = {
  address: Scalars['String']['input'];
  id: Scalars['String']['input'];
};

export type Tx = {
  __typename?: 'Tx';
  hash: Scalars['String']['output'];
  info?: Maybe<TxInfo>;
};

export type TxInfo = {
  __typename?: 'TxInfo';
  fee: Scalars['String']['output'];
};

export type Version = {
  __typename?: 'Version';
  major?: Maybe<Scalars['Int']['output']>;
  minor?: Maybe<Scalars['Int']['output']>;
  patch?: Maybe<Scalars['Int']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AccountInfo: ResolverTypeWrapper<AccountInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BringDownInput: BringDownInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tx: ResolverTypeWrapper<Tx>;
  TxInfo: ResolverTypeWrapper<TxInfo>;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  Version: ResolverTypeWrapper<Version>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccountInfo: AccountInfo;
  Boolean: Scalars['Boolean']['output'];
  BringDownInput: BringDownInput;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  Tx: Tx;
  TxInfo: TxInfo;
  Upload: Scalars['Upload']['output'];
  Version: Version;
};

export type AccountInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountInfo'] = ResolversParentTypes['AccountInfo']> = {
  balance?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  bringDown?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationBringDownArgs, 'params'>>;
  charge?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationChargeArgs, 'address' | 'id' | 'value'>>;
  createWallet?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationCreateWalletArgs, 'balance' | 'id' | 'walletId'>>;
  sendBoc?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tx']>>>, ParentType, ContextType, RequireFields<MutationSendBocArgs, 'boc64' | 'id'>>;
  spawn?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSpawnArgs, 'id'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  account?: Resolver<Maybe<ResolversTypes['AccountInfo']>, ParentType, ContextType, RequireFields<QueryAccountArgs, 'address' | 'id'>>;
  snapshots?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Version']>, ParentType, ContextType>;
};

export type TxResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tx'] = ResolversParentTypes['Tx']> = {
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  info?: Resolver<Maybe<ResolversTypes['TxInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TxInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['TxInfo'] = ResolversParentTypes['TxInfo']> = {
  fee?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type VersionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Version'] = ResolversParentTypes['Version']> = {
  major?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  minor?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  patch?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AccountInfo?: AccountInfoResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tx?: TxResolvers<ContextType>;
  TxInfo?: TxInfoResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  Version?: VersionResolvers<ContextType>;
};

