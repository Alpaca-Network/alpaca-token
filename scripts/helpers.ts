import {ethers} from 'hardhat';
import {expect} from 'chai';

export const getAddr = async (ethers: any) => {
  const [owner, proxyOwner, bob, alice, user3, user4, badUser1, badUser2, fakeContract, daoTreasury] = await ethers.getSigners();
  bob.name = 'bob';
  alice.name = 'alice';

  return {
    owner,
    proxyOwner,
    bob,
    alice,
    user3,
    user4,
    badUser1,
    badUser2,
    fakeContract,
    daoTreasury
  };
};


export const deployNew = async (contractName: string, params: any[] = []) => {
    const C = await ethers.getContractFactory(contractName)
    return await C.deploy(...params)
}
