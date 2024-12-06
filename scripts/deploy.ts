import { ethers, upgrades } from "hardhat";
import { getImplementationAddress } from "@openzeppelin/upgrades-core"; // Import the helper function

async function main() {
    console.log("Deploying as implementation on Tenderly.");

    const Test = await ethers.getContractFactory("Test");

    const defaultAdmin = "0x6352aFD6a02f683833D19e12F21d174ca58BFb94"; // admin address
    const taxAdmin = "0x6352aFD6a02f683833D19e12F21d174ca58BFb94"; // tax admin address
    const upgrader = "0x6352aFD6a02f683833D19e12F21d174ca58BFb94"; // upgrader address

    let proxyContract = await upgrades.deployProxy(Test, [defaultAdmin, taxAdmin, upgrader], {
        initializer: "initialize",
    });
    proxyContract = await proxyContract.waitForDeployment();

    const proxyAddress = await proxyContract.getAddress();
    console.log("Test proxy deployed to:", proxyAddress);

    // Retrieve the implementation address
    const implementationAddress = await getImplementationAddress(ethers.provider, proxyAddress);
    console.log("Test impl deployed to:", implementationAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
