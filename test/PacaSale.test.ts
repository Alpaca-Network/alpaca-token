import { ethers, network } from "hardhat";
import { expect } from "chai";
import { deployNew } from "../scripts/helpers";

describe("PacaSale", async () => {
    let owner: any, user: any, user0: any, user1: any, user2: any, user3: any, user4: any, user5: any;
    let PacaSale: any;
    let PacaToken: any;
    let usdc: any, usdt: any;
    before(async () => {
        [owner, user, user0, user1, user2, user3, user4, user5] = await ethers.getSigners();
        PacaToken = await deployNew("MockToken", ["Alpaca Network", "Paca", 18]);
        usdc = await deployNew("MockToken", ["USDC", "USDC", 18]);
        usdt = await deployNew("MockToken", ["USDT", "USDT", 18]);

        PacaSale = await deployNew("PacaSale", [PacaToken.address, user0.address]);

    })

    describe("Config", async () => {
        it("", async function () {
            
          });    
    })

})