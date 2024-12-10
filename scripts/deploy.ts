import { ethers, upgrades } from "hardhat";
import { getImplementationAddress } from "@openzeppelin/upgrades-core"; // Import the helper function

async function main() {
    console.log("Deploying as implementation on Tenderly.");

    const PacaAI = await ethers.getContractFactory("PacaAI");

    const defaultAdmin = "0xd733EBC081b302914f050b3ffBC1914b46B7783D"; // admin address
    const taxAdmin = "0xd733EBC081b302914f050b3ffBC1914b46B7783D"; // tax admin address
    const upgrader = "0xd733EBC081b302914f050b3ffBC1914b46B7783D"; // upgrader address
    const treasuryWallet = "0x80F427afE376094122aDA221E49505f3fb3703F1"; // treasury address

    let proxyContract = await upgrades.deployProxy(PacaAI, [defaultAdmin, taxAdmin, upgrader, treasuryWallet], {
        initializer: "initialize",
    });
    proxyContract = await proxyContract.waitForDeployment();

    const proxyAddress = await proxyContract.getAddress();
    console.log("PacaAI proxy deployed to:", proxyAddress);

    // Retrieve the implementation address
    const implementationAddress = await getImplementationAddress(ethers.provider, proxyAddress);
    console.log("PacaAI impl deployed to:", implementationAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
