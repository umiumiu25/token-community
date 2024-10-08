const { ethers } = require("hardhat");
const fs = require("fs");

const main = async () => {
  const addr1 = "0x18005BEDB82173B5687C3198F6b5E07f281dAbBC";
  const addr2 = "0x80Fc7308dDfF6A176BA4A28f8f569Fa0D6aCeA50";
  // const addr3 = "0xc33bFd695d560d176CdC5b947e42daA66293F8A8";

  const tokenURI1 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata1.json";
  const tokenURI2 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata2.json";
  const tokenURI3 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata3.json";
  const tokenURI4 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata4.json";
  // const tokenURI5 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata5.json";

  // デプロイ
  const MemberNFT = await ethers.getContractFactory("MemberNFT");
  const memberNFT = await MemberNFT.deploy();
  await memberNFT.deployed();

  console.log(`Contract deployed to: https://goerli.etherscan.io/address/${memberNFT.address}`);

  // NFTをmintする
  let tx = await memberNFT.nftMint(addr1, tokenURI1);
  await tx.wait();
  console.log("NFT#1 minted");
  tx = await memberNFT.nftMint(addr1, tokenURI2);
  await tx.wait();
  console.log("NFT#2 minted");
  tx = await memberNFT.nftMint(addr2, tokenURI3);
  await tx.wait();
  console.log("NFT#3 minted");
  tx = await memberNFT.nftMint(addr2, tokenURI4);
  await tx.wait();
  console.log("NFT#4 minted");

  // コントラクトアドレスの書き出し
  fs.writeFileSync("./memberNFTContract.js",
    `
      module.exports = "${memberNFT.address}"
    `
  );
};

const memberNFTDeploy = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

memberNFTDeploy();
