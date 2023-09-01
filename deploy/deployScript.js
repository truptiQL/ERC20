module.exports = async ({ getNamedAccounts, deployments}) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    await deploy("MyToken", {
      from: deployer,
      args: ["MyToken", "MT", 4],
      log: true,
      default: 0,
    });
  };
  module.exports.tags = ["MyToken"];
