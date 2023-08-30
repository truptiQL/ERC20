const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("hardhat");
const chai = require("chai");
chai.use(require("chai-bignumber")(ethers.BigNumber));

describe("MyToken", async function () {
  beforeEach(async function () {
    ///@dev deploying code
    name = "Token1";
    symbol = "T1";
    decimals = 4;

    const MyToken = await hre.ethers.getContractFactory("MyToken");
    mytoken = await MyToken.deploy(name, symbol, decimals);
  });

  describe("getters", function () {
    it("should be equal to name of contract", async function () {
      expect(await mytoken.name()).to.eql(name);
    });

    it("should be equal to symbol of contract", async function () {
      expect(await mytoken.symbol()).to.eql(symbol);
    });

    it("should be equal to decimals of contract", async function () {
      expect(await mytoken.decimals()).to.eql(decimals);
    });
  });

  describe("transfer", function () {
    it("should revert", async function () {
      const [owner, addr1] = await ethers.getSigners();
      await expect(
        mytoken.connect(addr1).transfer(owner.address, 100)
      ).to.be.revertedWith("Insufficient balance for this transaction");
    });

    it("should emit transfer event", async function () {
      const [owner, addr1] = await ethers.getSigners();
      await mytoken.mint(owner.address, 20);
      expect(await mytoken.transfer(addr1.address, 10)).to.emit(
        mytoken,
        "Transfer"
      );
    });

    it("should return true", async function () {
      const [owner, addr1] = await ethers.getSigners();
      await mytoken.mint(owner.address, 200);
      expect(await mytoken.transfer(addr1.address, 1)).to.be.ok;
    });
  });

  describe("transferFrom", function () {
    it("should be reverted for insufficient allowance", async function () {
      const [owner, addr1, addr2] = await ethers.getSigners();
      await expect(
        mytoken.connect(addr1).transferFrom(owner.address, addr2.address, 5)
      ).to.be.revertedWith("Insufficient allowance for this transaction");
    });
  });

  describe("mint", function () {
    it("should totalSupply incremented by number of minted token", async function () {
      const [owner, addr1] = await ethers.getSigners();
      await mytoken.mint(addr1.address, 20);
      expect(await mytoken.balanceOf(addr1.address)).eq(20);
    });
    it("should revert", async function () {
      await expect(
        mytoken.mint("0x0000000000000000000000000000000000000000", 2)
      ).to.be.revertedWith("Zero address account is not allowed");
    });
  });

  describe("burn", function () {
    it("should be decremented totalSupply by number of burned token", async function () {
      const [owner, addr1] = await ethers.getSigners();
      let prevToken = await mytoken.balanceOf(addr1.address);
      await mytoken.mint(addr1.address, 10);
      await mytoken.burn(addr1.address, 10);
      expect(await mytoken.balanceOf(addr1.address)).eq(0);
    });
    it("should revert", async function () {
      await expect(
        mytoken.burn("0x0000000000000000000000000000000000000000", 2)
      ).to.be.revertedWith("Zero address account is not allowed");
    });
    it("should revert", async function () {
      const [owner] = await ethers.getSigners();
      await expect(mytoken.burn(owner.address, 500000)).to.be.revertedWith(
        "Insufficient balance"
      );
    });
  });

  describe("allowance", function () {
    it("should be reverted for insufficient balance", async function () {
      [owner, addr1, addr2] = await hre.ethers.getSigners();
      await mytoken.connect(addr1).approve(owner.address, 5);

      await expect(
        mytoken.transferFrom(addr1.address, addr2.address, 4)
      ).to.be.revertedWith("Insufficient balance for this transaction");
    });

    it("should be decrement allowance by number of tranferred token", async function () {
      await mytoken.mint(addr1.address, 50);
      await mytoken.connect(addr1).approve(owner.address, 5);
      await mytoken.transferFrom(addr1.address, addr2.address, 1);
      expect(await mytoken.allowance(addr1.address, owner.address)).eq(4);
    });
  });
});
