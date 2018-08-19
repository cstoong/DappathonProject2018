var StewdentApplication = artifacts.require("./StewdentApplication.sol");

module.exports = function(deployer) {
	deployer.deploy(StewdentApplication,
				  				"Testing"
	);
};
