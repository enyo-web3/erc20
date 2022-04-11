import { gql } from '@apollo/client';
import type { EnyoSubgraph } from '@enyo-web3/core';
import type { ProvidersWithEthers } from '@enyo-web3/ethers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ethers } from 'ethers';

const erc20Interface = [
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
  'function decimals() external view returns (uint8)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
];

export interface ERC20Token {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: ethers.BigNumber;
}

export class ERC20Subgraph implements EnyoSubgraph<ProvidersWithEthers> {
  schema(providers: ProvidersWithEthers) {
    const ethersProvider = providers.ethers;

    return makeExecutableSchema({
      typeDefs: this.typeDefs(),
      resolvers: {
        Query: {
          erc20() {
            return {};
          },
        },
        ERC20: {
          async token(_, args) {
            if (!args || !args.id) {
              throw new Error('must specify a token address as "id"');
            }

            if (!args.network) {
              throw new Error('must specify network');
            }

            const result = await ethersProvider.multicall(args.network, erc20Interface, [
              { target: args.id, functionName: 'name' },
              { target: args.id, functionName: 'symbol' },
              { target: args.id, functionName: 'decimals' },
              { target: args.id, functionName: 'totalSupply' },
            ]);

            const newToken: ERC20Token & { __typename: string } = {
              __typename: 'ERC20Token',
              id: args.id,
              name: result[0][0],
              symbol: result[1][0],
              decimals: result[2][0],
              totalSupply: result[3][0],
            };

            return newToken;
          },
        },
      },
    });
  }

  typeDefs() {
    return gql`
      type Query {
        erc20: ERC20;
      }

      type ERC20 {
        token(id: ID!, network: Network!): ERC20Token
      }

      type ERC20Token {
        id: ID!
        name: String!
        symbol: String!
        decimals: Int!
        totalSupply: BigInt!
      }

      scalar BigInt
      scalar Network
    `;
  }
}
