import { ethers, network } from "hardhat";
import { expect } from "chai";
import { deployNew } from "../scripts/helpers";

describe("Paca Pre-launch", async () => {
    let owner: any, user: any, user0: any, user1: any, user2: any, user3: any, user4: any, user5: any;
    let PacaSale: any;
    let PacaToken: any;
    let usdc: any, usdt: any;
    before(async () => {
        [owner, user, user0, user1, user2, user3, user4, user5] = await ethers.getSigners();
        PacaToken = await deployNew("PacaToken");
        PacaSale = await deployNew("PacaSale", [PacaToken.address, user5.address]);
        usdc = await deployNew("MockToken", ["USDC", "USDC"]);
        usdt = await deployNew("MockToken", ["USDT", "USDT"]);

        PacaSale = await deployNew("PacaSale", [PacaToken.address, user0.address]);

    })

    describe("PacaToken", async () => {
        it("Should be worked updateTaxEnabled function", async function () {
            const isEnabledBefore = await PacaToken.taxEnabled();
            expect(isEnabledBefore).to.equal(false);
            await expect(PacaToken.connect(owner).updateTaxEnabled(true)).to.emit(PacaToken, "TaxEnabled").withArgs(true);
            const isEnabled = await PacaToken.taxEnabled();
            expect(isEnabled).to.equal(true);
        });
        
        it("Should be worked updateFees function", async function () {
            
            await expect(PacaToken.connect(owner).updateFees(30)).to.emit(PacaToken, "UpdatedTradeFee").withArgs(30);
            const fee = await PacaToken.tradeFee();
            expect(fee).to.equal(30);

            await expect(PacaToken.connect(owner).updateFees(3000)).to.be.revertedWith("Buy fees must be <= 5%.");
        });

        it("Should be worked updateTreasuryWallet function", async function () {
            
            await expect(PacaToken.connect(owner).updateTreasuryWallet(user0.address)).to.emit(PacaToken, "TreasuryWalletUpdated");
        });


        it("Should be worked setAutomatedMarketMakerPair function", async function () {
            
            await expect(PacaToken.connect(owner).setAutomatedMarketMakerPair(user0.address, true)).to.emit(PacaToken, "SetAutomatedMarketMakerPair");
        });

        it("Charging the Trading fee", async function () {
            await PacaToken.connect(owner).updateTaxEnabled(true);
            await PacaToken.connect(owner).updateFees(300) // 3% tax fee
            await PacaToken.connect(owner).updateTreasuryWallet(user0.address)
            await PacaToken.connect(owner).setAutomatedMarketMakerPair(user1.address, true)

            await PacaToken.connect(owner).transfer(user1.address, 10000);
            expect(await PacaToken.balanceOf(PacaToken.treasury())).to.equal(300);
        });

        it("WithdrawStuckToken", async function () {
            

            await usdc.connect(owner).transfer(PacaToken.address, 10000);
            expect(await usdc.balanceOf(PacaToken.address)).to.equal(10000);

            await PacaToken.connect(owner).withdrawStuckToken(usdc.address, user2.address);

            expect(await usdc.balanceOf(user2.address)).to.equal(10000)


        });


        it("withdrawStuckEth", async function () {
            
            // Send ETH
            const tx = await owner.sendTransaction({
                to: PacaToken.address,
                value: ethers.utils.parseEther("1") // Convert ETH to Wei
            });

            await tx.wait();

            expect(await ethers.provider.getBalance(PacaToken.address)).to.equal(
                ethers.utils.parseEther("1.0")
            );
            const user0InitialBalance = await ethers.provider.getBalance(user0.address);

            // expect(await ethers.provider.getBalance(usdc.address)).to.equal(ethers.utils.parseEther("0"));
            await PacaToken.connect(owner).withdrawStuckEth(user0.address)

            expect(await ethers.provider.getBalance(user0.address)).to.equal(
                user0InitialBalance.add(ethers.utils.parseEther("1.0"))
            );

        });
    })
    describe("PacaSale", async () => {
        it("Should be worked setMaxBuyAmount function", async function () {
            await expect(PacaSale.connect(owner).setMaxBuyAmount(1000)).to.emit(PacaSale, "SetMaxBuyAmount");
        });

        it("Should be worked setTreasury function", async function () {
            await expect(PacaSale.connect(owner).setTreasury(user0.address)).to.emit(PacaSale, "SetTreasury");
        });

        it("Should be worked setTokenPrice function", async function () {
            await expect(PacaSale.connect(owner).setTokenPrice(100000)).to.emit(PacaSale, "SetTokenPrice");
        });

        it("Buy Paca", async function () {
            await PacaSale.connect(owner).setMaxBuyAmount(ethers.utils.parseEther("10000"))
            await PacaSale.connect(owner).setTokenPrice(1);
            expect(await PacaSale.connect(user2).buyPaca(ethers.utils.parseEther("10"), {
                value: ethers.utils.parseEther("10"), // Replace "10" with the ETH amount to send
            })).to.emit(PacaSale, "PurchasePacaToken")

            expect(await PacaSale.salesLockup(user2.address)).to.equal(ethers.utils.parseEther("10"))
        });
  
        
    })

})