import { HardhatUserConfig } from "hardhat/config";
import '@openzeppelin/hardhat-upgrades';
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  // solidity: "0.8.22",
  solidity: {
    compilers: [
      {
        version: "0.8.22"
      }
    ]
  }
};

export default config;
