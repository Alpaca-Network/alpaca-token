
const hre = require("hardhat");
async function main() {

    // console.log("xmoz");
    // await hre.run("verify:verify", {
    //     address: "0x98fbE68d9964F6B86Ff6aA9767139e1731f4F255",
    //     constructorArguments: [
    //         "XMOZ",
    //         "xmoz",
    //         18
    //     ],
    // });
    // await hre.run("verify:verify", {
    //     address: "0x2Dc9d44DC4BA74946fFca561Bc3aEF0a7b3d4251",
    //     constructorArguments: [
    //         "USDC",
    //         "usdc",
    //         18
    //     ],
    // });
    // await hre.run("verify:verify", {
    //     address: "0xDd302224FDd93e7C42D5a623ecA36e8E42BF92e0",
    //     constructorArguments: [
    //         "USDT",
    //         "usdt",
    //         18
    //     ],
    // });
    console.log("staking");
    await hre.run("verify:verify", {
        address: "0x464727340B5D295f5eb691BC6E1F8E207e68109F",
        constructorArguments: [
            "0x288734c9d9db21C5660B6b893F513cb04B6cD2d6",
            1709038800
        ],
    }); 

    //     await hre.run("verify:verify", {
    //     address: "0xFF66ccE6F8F9E57bEBe4dBFD5D9f68B9B1a448bc",
    //     constructorArguments: [],
    // });
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});