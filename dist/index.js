var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { gql } from '@apollo/client';
import { makeExecutableSchema } from '@graphql-tools/schema';
const erc20Interface = [
    'function name() external view returns (string)',
    'function symbol() external view returns (string)',
    'function decimals() external view returns (uint8)',
    'function totalSupply() external view returns (uint256)',
    'function balanceOf(address account) external view returns (uint256)',
];
export class ERC20Subgraph {
    schema(providers) {
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
                    token(_, args) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (!args || !args.id) {
                                throw new Error('must specify a token address as "id"');
                            }
                            if (!args.network) {
                                throw new Error('must specify network');
                            }
                            const result = yield ethersProvider.multicall(args.network, erc20Interface, [
                                { target: args.id, functionName: 'name' },
                                { target: args.id, functionName: 'symbol' },
                                { target: args.id, functionName: 'decimals' },
                                { target: args.id, functionName: 'totalSupply' },
                            ]);
                            const newToken = {
                                __typename: 'ERC20Token',
                                id: args.id,
                                name: result[0][0],
                                symbol: result[1][0],
                                decimals: result[2][0],
                                totalSupply: result[3][0],
                            };
                            return newToken;
                        });
                    },
                },
            },
        });
    }
    typeDefs() {
        return gql `
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
//# sourceMappingURL=index.js.map