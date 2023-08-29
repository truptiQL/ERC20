const hre = require("hardhat");

async function main() {
  const name = "MyToken";
  const symbol = "MT";
  const decimals = 4;

  const MyToken = await hre.ethers.getContractFactory("MyToken");
  //   console.log(MyToken);

  const mytoken = await MyToken.deploy(name, symbol, decimals);
  //   console.log(mytoken);

  await mytoken.deployed();

  console.log(
    `MyToken with name ${name}, symbol ${symbol}, decimals ${decimals} deployed to ${mytoken.address} `
  );

  // TO verify the contract
  await hre.run("verify:verify", {
    address: mytoken.address,  //"0xa2F2A46F20F9c1a720ee3a9ad6198f16cDBc5085"
    constructorArguments: [name, symbol, decimals],
  });
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
