const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenBankコントラクト", function () {
  let TokenBank;
  let tokenBank;
  const name = "Token";
  const symbol = "TBK";
  let owner;
  let addr1;
  let addr2;
  let addr3;
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    TokenBank = await ethers.getContractFactory("TokenBank");
    tokenBank = await TokenBank.deploy(name, symbol);
    await tokenBank.deployed();
  });

  describe("デプロイ", function () {
    it("トークンの名前とシンボルがセットされるべき", async function () {
      expect(await tokenBank.name()).to.equal(name);
      expect(await tokenBank.symbol()).to.equal(symbol);
    });
    it("デプロイアドレスがownerに設定されるべき", async function () {
      expect(await tokenBank.owner()).to.equal(owner.address);
    });
    it("ownerに総額が割り当てられるべき", async function () {
      const ownerBalance = await tokenBank.balanceOf(owner.address);
      expect(ownerBalance).to.equal(await tokenBank.totalSupply());
    });
    it("預かっているTokenの総額が0であるべき", async function () {
      expect(await tokenBank.bankTotalDeposit()).to.equal(0);
    });
  });

  describe("アドレス間トランザクション", function () {
    beforeEach(async function () {
      const tx = await tokenBank.transfer(addr1.address, 500);
      await tx.wait();
    });
    it("トークン移転がされるべき", async function () {
      const startAddr1Balance = await tokenBank.balanceOf(addr1.address);
      const startAddr2Balance = await tokenBank.balanceOf(addr2.address);

      const tx = await tokenBank.connect(addr1).transfer(addr2.address, 100);
      await tx.wait();

      const endAddr1Balance = await tokenBank.balanceOf(addr1.address);
      const endAddr2Balance = await tokenBank.balanceOf(addr2.address);

      expect(endAddr1Balance).to.equal(startAddr1Balance.sub(100));
      expect(endAddr2Balance).to.equal(startAddr2Balance.add(100));
    });
    it("ゼロアドレス宛の移転は失敗すべき", async function () {
      await expect(tokenBank.transfer(zeroAddress, 100)).to.be.revertedWith("Zero address cannot be specified for 'to'!");
    });
    it("残高不足の場合は移転に失敗すべき", async function () {
      await expect(tokenBank.connect(addr1).transfer(addr2.address, 510)).to.be.revertedWith("Insufficient balance!");
    });
    it("移転後には'TokenTransfer'イベントが発行されるべき", async function () {
      await expect(tokenBank.connect(addr1).transfer(addr2.address, 500)).emit(tokenBank, "TokenTransfer").withArgs(addr1.address, addr2.address, 500);
    });
  });

  describe("Bankトランザクション", function () {
    beforeEach(async function () {
      await (await tokenBank.transfer(addr1.address, 500)).wait();
      await (await tokenBank.transfer(addr2.address, 200)).wait();
      await (await tokenBank.transfer(addr3.address, 100)).wait();
      await (await tokenBank.connect(addr1).deposit(100)).wait();
      await (await tokenBank.connect(addr2).deposit(200)).wait();
    });
    it("トークン預入が実行できるべき", async function () {
      const addr1Balance = await tokenBank.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(400);
      const addr1BankBalance = await tokenBank.bankBalanceOf(addr1.address);
      expect(addr1BankBalance).to.equal(100);
    });
    it("預入後にもトークンを移転できるべき", async function () {
      const startAddr1Balance = await tokenBank.balanceOf(addr1.address);
      const startAddr2Balance = await tokenBank.balanceOf(addr2.address);

      const tx = await tokenBank.connect(addr1).transfer(addr2.address, 100);
      await tx.wait();

      const endAddr1Balance = await tokenBank.balanceOf(addr1.address);
      const endAddr2Balance = await tokenBank.balanceOf(addr2.address);

      expect(endAddr1Balance).to.equal(startAddr1Balance.sub(100));
      expect(endAddr2Balance).to.equal(startAddr2Balance.add(100));
    });
    it("預入後には'TokenDeposit'イベントが発行されるべき", async function () {
      await expect(tokenBank.connect(addr1).deposit(100)).emit(tokenBank, "TokenDeposit").withArgs(addr1.address, 100);
    });
  });
});