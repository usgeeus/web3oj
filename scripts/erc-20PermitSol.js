const { ethers, network } = require("hardhat");
const hre = require("hardhat");
const { getPermitSignature } = require("../utils/getPermitSignature.js");

async function erc20PermitSol() {
  const chainId = network.config.chainId;
  let accounts = await ethers.getSigners(1);
  let signer = accounts[0];
  const Web3OJTPermitable = await ethers.getContractFactory(
    "Web3OJTPermitable"
  );
  console.log(chainId);
  let web3OJTPermitable;
  if (chainId == 31337) {
    web3OJTPermitable = await Web3OJTPermitable.connect(signer).deploy();
    await web3OJTPermitable.deployed();
  } else {
    const instance = "0xEeA9DCbBE19c9ecdE3D0e67CCb2B385f81596cB4"; // 이곳에 덧셈 문제 인스턴스 컨트랙트 주소를 넣으세요
    web3OJTPermitable = Web3OJTPermitable.attach(instance);
  }
  const amount = ethers.utils.parseEther("20");
  const deadline = ethers.constants.MaxUint256;
  //------
  const { v, r, s } = await getPermitSignature(
    signer,
    web3OJTPermitable,
    //signer.address,
    ethers.utils.getAddress("0xEeA9DCbBE19c9ecdE3D0e67CCb2B385f81596cB4"),
    amount,
    deadline
  );
  //------
  /**
   * function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    )
   */
  const tx = await web3OJTPermitable.connect(signer).permit(
    signer.address,
    ethers.utils.getAddress("0xEeA9DCbBE19c9ecdE3D0e67CCb2B385f81596cB4"),
    //signer.address,
    amount,
    deadline,
    v,
    r,
    s
  );

  const txReceipt = await tx.wait(1);
  console.log(txReceipt.events[0]);
}

async function main() {
  erc20PermitSol();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
