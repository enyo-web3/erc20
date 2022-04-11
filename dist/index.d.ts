import { EnyoSubgraph } from '@enyo-web3/core';
import type { ProvidersWithEthers } from '@enyo-web3/ethers';
import { ethers } from 'ethers';
export interface ERC20Token {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: ethers.BigNumber;
}
export declare class ERC20Subgraph extends EnyoSubgraph<ProvidersWithEthers> {
    schema(providers: ProvidersWithEthers): import("graphql").GraphQLSchema;
    typeDefs(): import("@apollo/client").DocumentNode;
}
