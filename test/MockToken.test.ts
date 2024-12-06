import { ethers, upgrades } from "hardhat";
import { expect } from "chai";

describe("MockToken local test", async () => {
    let owner: any, taxAdmin: any, upgrader: any, user1: any, user2: any, user3: any, user4: any, user5: any;
    let Mock: any;

    before(async () => {
        // Get signers
        [owner, taxAdmin, upgrader, user1, user2, user3, user4, user5] = await ethers.getSigners();

        // Deploy MockToken as a proxy with initialization parameters
        const MockToken = await ethers.getContractFactory("Mock");
        Mock = await upgrades.deployProxy(
            MockToken,
            [owner.address, taxAdmin.address, upgrader.address],
            { initializer: "initialize" }
        );

        // Assign roles explicitly
        const TAX_ADMIN_ROLE = await Mock.TAX_ADMIN_ROLE();
        await Mock.connect(owner).grantRole(TAX_ADMIN_ROLE, taxAdmin.address);
    });

    describe("Mock", async () => {
        it("function test: updateTaxEnabled", async function () {
            const isEnabledBefore = await Mock.taxEnabled();
            expect(isEnabledBefore).to.equal(true);

            await expect(Mock.connect(taxAdmin).updateTaxEnabled(false))
                .to.emit(Mock, "TaxEnabled")
                .withArgs(false);

            const isEnabled = await Mock.taxEnabled();
            expect(isEnabled).to.equal(false);
        });

        it("function test: updateFees", async function () {
            await expect(Mock.connect(taxAdmin).updateFees(1000, 500))
                .to.emit(Mock, "UpdatedTradeFee")
                .withArgs(1000, 500);

            const buyFee = await Mock.buyFee();
            const sellFee = await Mock.sellFee();

            expect(buyFee).to.equal(1000);
            expect(sellFee).to.equal(500);
        });

        it("function test: updateTreasuryWallet", async function () {
            const previousTreasury = await Mock.treasury();
            await expect(Mock.connect(taxAdmin).updateTreasuryWallet(user5.address))
                .to.emit(Mock, "TreasuryWalletUpdated")
                .withArgs(user5.address, previousTreasury);

            expect(await Mock.treasury()).to.equal(user5.address);
        });

        it("function test: addDex", async function () {
            await expect(Mock.connect(taxAdmin).addDex(user5.address, true))
                .to.emit(Mock, "DexAdded")
                .withArgs(user5.address, true);

            expect(await Mock.dexes(user5.address)).to.equal(true);
        });

        it("Charging the Trading fee", async function () {
            await Mock.connect(taxAdmin).updateTaxEnabled(true);
            await Mock.connect(taxAdmin).updateFees(1000, 500); // 10%/5% buy/sell tax fee
            await Mock.connect(taxAdmin).updateTreasuryWallet(user5.address);
            await Mock.connect(taxAdmin).addDex(user1.address, true);

            // Simulate a transfer (buy scenario)
            await expect(Mock.connect(owner).transfer(user1.address, 20000))
                .to.emit(Mock, "FeeCharged")
                .withArgs(Mock.treasury(), 1000);
            expect(await Mock.balanceOf(Mock.treasury())).to.equal(1000);

            // Simulate another transfer (sell scenario)
            await expect(Mock.connect(user1).transfer(user3.address, 10000))
                .to.emit(Mock, "FeeCharged")
                .withArgs(Mock.treasury(), 1000);
            expect(await Mock.balanceOf(Mock.treasury())).to.equal(2000);
        });
    });
});
