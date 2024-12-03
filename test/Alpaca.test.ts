import { ethers, network } from "hardhat";
import { expect } from "chai";
import { deployNew } from "../scripts/helpers";

describe("Alpaca local test", async () => {
    let owner: any, taxAdmin: any, upgrader: any, user1: any, user2: any, user3: any, user4: any, user5: any;
    let PacaToken: any, v3Factory: any;
    let usdc: any;
    before(async () => {
        [owner, taxAdmin, upgrader, user1, user2, user3, user4, user5] = await ethers.getSigners();
        PacaToken = await deployNew("Alpaca");
        await PacaToken.connect(owner).initialize(owner.address, taxAdmin.address, upgrader.address);

    })

    describe("PacaToken", async () => {
        it("function test: updateTaxEnabled ", async function () {
            const isEnabledBefore = await PacaToken.taxEnabled();
            expect(isEnabledBefore).to.equal(true);
            await expect(PacaToken.connect(taxAdmin).updateTaxEnabled(false)).to.emit(PacaToken, "TaxEnabled").withArgs(false);
            const isEnabled = await PacaToken.taxEnabled();
            expect(isEnabled).to.equal(false);
        });

        it("function test: updateFees", async function () {
            
            await expect(PacaToken.connect(taxAdmin).updateFees(1000, 500)).to.emit(PacaToken, "UpdatedTradeFee").withArgs(1000, 500);
            const buyFee = await PacaToken.buyFee();
            expect(buyFee).to.equal(1000);
        });

        it("function test: updateTreasuryWallet", async function () {
            
            await expect(PacaToken.connect(taxAdmin).updateTreasuryWallet(user5.address)).to.emit(PacaToken, "TreasuryWalletUpdated");
        });


        it("function test: setLPAddress", async function () {
            
            await expect(PacaToken.connect(taxAdmin).setLPAddress(user5.address, true)).to.emit(PacaToken, "SetLPAddress");
        });

        it("Charging the Trading fee", async function () {
            await PacaToken.connect(taxAdmin).updateTaxEnabled(true);
            await PacaToken.connect(taxAdmin).updateFees(1000, 500) // 10%/5% buy/sell tax fee
            await PacaToken.connect(taxAdmin).updateTreasuryWallet(user5.address)
            await PacaToken.connect(taxAdmin).setLPAddress(user1.address, true)

            await PacaToken.connect(owner).transfer(user1.address, 20000);
            expect(await PacaToken.balanceOf(PacaToken.treasury())).to.equal(1000);
            await PacaToken.connect(user1).transfer(user3.address, 10000);
            expect(await PacaToken.balanceOf(PacaToken.treasury())).to.equal(2000);
        });
        
    })
})