module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Greeter", {
    from: deployer,
    args: ["Hello Celo"],
    log: true,
  });

  await deploy("Storage", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    //args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
  });

  await deploy("CeloBox", {
    from: deployer,
    args: [],
    log: true,
  });
};

module.exports.tags = ["Greeter", "Storage", "CeloBox"];
