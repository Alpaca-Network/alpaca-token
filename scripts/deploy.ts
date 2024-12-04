import { ethers, upgrades } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const weiAmount = await ethers.provider.getBalance(deployer.address);

    console.log("Account balance:", ethers.formatEther(weiAmount));

    // Get the contract factory
    const Token = await ethers.getContractFactory("Alpaca");

    // Deploy the proxy with initialization parameters
    const token = await upgrades.deployProxy(Token, [deployer.address, deployer.address, deployer.address], {
        initializer: "initialize", // This matches the initialize function in the contract
    });

    // Log the proxy contract address
    console.log("Token proxy address:", await token.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
