import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const weiAmount = (await hre.ethers.provider.getBalance(deployer.address));
    
    console.log("Account balance:", (await ethers.formatEther(weiAmount)));
  
    const Token = await ethers.getContractFactory("Alpaca");
    const token = await Token.deploy(deployer.address);
  
  // log the address of the Contract in our console
    console.log("Token address:", token.getAddress());
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });