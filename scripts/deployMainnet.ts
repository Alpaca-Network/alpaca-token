import { ethers } from "hardhat"
import { deployNew } from "./helpers";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Eth balance", await deployer.getBalance());
    const xmozAddress = "0x288734c9d9db21C5660B6b893F513cb04B6cD2d6";
    const treasury = "0x26E17aDa97868A75FFbF01bB36DC84dcAC180f83";
    const wEthAddress = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";    
    const xMozStaking = await deployNew("XMozStaking", [xmozAddress, 1709038800]);
    console.log("xMozStaking", xMozStaking.address);
    await xMozStaking.setRewardConfig([xmozAddress, wEthAddress], ["10000000000000000000", "10000000000000000"]);
    await xMozStaking.setFee(150);
    await xMozStaking.setTreasury(treasury);
    console.log("xMozStaking", xMozStaking.address);
}
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });