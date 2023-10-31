const { ethers } = require("hardhat");
const fs = require("fs");
const memberNFTAddress = require("../memberNFTContract");

const main = async () => {
  const addr1 = "0x18005BEDB82173B5687C3198F6b5E07f281dAbBC";
  const addr2 = "0x80Fc7308dDfF6A176BA4A28f8f569Fa0D6aCeA50";
  const addr3 = "0xc33bFd695d560d176CdC5b947e42daA66293F8A8";
  const addr4 = "0xA962eABDc4a5D061C8eb13705eE96dAb3B0FcceC";

  // デプロイ
  const TokenBank = await ethers.getContractFactory("TokenBank");
  const tokenBank = await TokenBank.deploy("TokenBank", "TBK", memberNFTAddress);
  await tokenBank.deployed();
  console.log(`Contract deployed to: https://goerli.etherscan.io/address/${tokenBank.address}`);

  // トークンを移転する
  let tx = await tokenBank.transfer(addr2, 300);
  await tx.wait();
  console.log("transferred to addr2");
  tx = await tokenBank.transfer(addr3, 200);
  await tx.wait();
  console.log("transferred to addr3");
  tx = await tokenBank.transfer(addr4, 100);
  await tx.wait();
  console.log("transferred to addr4");

  // Verifyで読み込むarugument.jsを生成
  fs.writeFileSync("./argument.js",
    `
      module.exports = [
        "TokenBank",
        "TBK",
        "${memberNFTAddress}"
      ]
    `
  );

  // フロントエンドアプリが読み込むcontract.jsを生成
  fs.writeFileSync("./memberNFTContract.js",
    `
      export const memberNFTAddress = "${memberNFTAddress}";
      export const tokenBankAddress = "${tokenBank.address}"
    `
  );
};

const tokenBankDeploy = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

tokenBankDeploy();