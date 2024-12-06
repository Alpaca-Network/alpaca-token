import { ethers, upgrades } from "hardhat";
import { getImplementationAddress } from "@openzeppelin/upgrades-core"; // Import the helper function

async function main() {
    console.log("Deploying as implementation on Tenderly.");

    const Test = await ethers.getContractFactory("Test");

    const defaultAdmin = "0xSetAddr"; // admin address
    const taxAdmin = "0xSetAddr"; // tax admin address
    const upgrader = "0xSetAddr"; // upgrader address

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
