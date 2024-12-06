import { ethers, upgrades } from "hardhat";
import { expect } from "chai";

describe("MockToken local test", async () => {
    let owner: any, taxAdmin: any, upgrader: any, user1: any, user2: any, user3: any, user4: any, user5: any;
    let PacaToken: any;

    before(async () => {
        // Get signers
        [owner, taxAdmin, upgrader, user1, user2, user3, user4, user5] = await ethers.getSigners();

        // Deploy MockToken as a proxy with initialization parameters
        const MockToken = await ethers.getContractFactory("MockToken");
        PacaToken = await upgrades.deployProxy(
            MockToken,
            [owner.address, taxAdmin.address, upgrader.address],
            { initializer: "initialize" }
        );

        // Assign roles explicitly
        const TAX_ADMIN_ROLE = await PacaToken.TAX_ADMIN_ROLE();
        await PacaToken.connect(owner).grantRole(TAX_ADMIN_ROLE, taxAdmin.address);
    });

    describe("PacaToken", async () => {
        it("function test: updateTaxEnabled", async function () {
            const isEnabledBefore = await PacaToken.taxEnabled();
            expect(isEnabledBefore).to.equal(true);

            await expect(PacaToken.connect(taxAdmin).updateTaxEnabled(false))
                .to.emit(PacaToken, "TaxEnabled")
                .withArgs(false);

            const isEnabled = await PacaToken.taxEnabled();
            expect(isEnabled).to.equal(false);
        });

        it("function test: updateFees", async function () {
            await expect(PacaToken.connect(taxAdmin).updateFees(1000, 500))
                .to.emit(PacaToken, "UpdatedTradeFee")
                .withArgs(1000, 500);

            const buyFee = await PacaToken.buyFee();
            const sellFee = await PacaToken.sellFee();

            expect(buyFee).to.equal(1000);
            expect(sellFee).to.equal(500);
        });

        it("function test: updateTreasuryWallet", async function () {
            const previousTreasury = await PacaToken.treasury();
            await expect(PacaToken.connect(taxAdmin).updateTreasuryWallet(user5.address))
                .to.emit(PacaToken, "TreasuryWalletUpdated")
                .withArgs(user5.address, previousTreasury);

            expect(await PacaToken.treasury()).to.equal(user5.address);
        });

        it("function test: addDex", async function () {
            await expect(PacaToken.connect(taxAdmin).addDex(user5.address, true))
                .to.emit(PacaToken, "DexAdded")
                .withArgs(user5.address, true);

            expect(await PacaToken.dexes(user5.address)).to.equal(true);
        });

        it("Charging the Trading fee", async function () {
            await PacaToken.connect(taxAdmin).updateTaxEnabled(true);
            await PacaToken.connect(taxAdmin).updateFees(1000, 500); // 10%/5% buy/sell tax fee
            await PacaToken.connect(taxAdmin).updateTreasuryWallet(user5.address);
            await PacaToken.connect(taxAdmin).addDex(user1.address, true);

            // Simulate a transfer (buy scenario)
            await expect(PacaToken.connect(owner).transfer(user1.address, 20000))
                .to.emit(PacaToken, "FeeCharged")
                .withArgs(PacaToken.treasury(), 1000);
            expect(await PacaToken.balanceOf(PacaToken.treasury())).to.equal(1000);

            // Simulate another transfer (sell scenario)
            await expect(PacaToken.connect(user1).transfer(user3.address, 10000))
                .to.emit(PacaToken, "FeeCharged")
                .withArgs(PacaToken.treasury(), 1000);
            expect(await PacaToken.balanceOf(PacaToken.treasury())).to.equal(2000);
        });
    });
});
