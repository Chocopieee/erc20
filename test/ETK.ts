import { ethers } from "hardhat";
import { Signer, BigNumber } from "ethers";
import { expect } from "chai";

describe("ExampleToken", function () {
  let ExampleToken;
  let exampleToken: any;
  let owner: Signer;
  let other: Signer;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();

    ExampleToken = await ethers.getContractFactory("ExampleToken");
    exampleToken = await ExampleToken.deploy();
    await exampleToken.deployed();
  });

  it("should have correct name, symbol and decimals", async function () {
    expect(await exampleToken.name()).to.equal("ExampleToken");
    expect(await exampleToken.symbol()).to.equal("ETK");
    expect(await exampleToken.decimals()).to.equal(18);
  });

  it("should assign initial balance to owner", async function () {
    const ownerBalance = await exampleToken.balanceOf(await owner.getAddress());
    expect(ownerBalance).to.equal(ethers.utils.parseUnits("1000000", 18));
  });

  it("should allow owner to mint tokens", async function () {
    const amountToMint = ethers.utils.parseUnits("100000", 18);
    await exampleToken.connect(owner).mint(await other.getAddress(), amountToMint);

    const otherBalance = await exampleToken.balanceOf(await other.getAddress());
    expect(otherBalance).to.equal(amountToMint);
  });

  it("should not allow non-owner to mint tokens", async function () {
    const amountToMint = ethers.utils.parseUnits("100000", 18);
    await expect(exampleToken.connect(other).mint(await other.getAddress(), amountToMint)).to.be.revertedWith("Ownable: caller is not the owner");

    const otherBalance = await exampleToken.balanceOf(await other.getAddress());
    expect(otherBalance).to.equal(0);
  });
});
