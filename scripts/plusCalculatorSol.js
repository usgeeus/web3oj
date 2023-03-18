const { ethers } = require("hardhat");
const hre = require("hardhat");

async function calculatorSol() {
  const [myAccount] = await ethers.getSigners();

  const MyPlusCalculator = await ethers.getContractFactory("MyPlusCalculator");
  const myPlusCalculator = await MyPlusCalculator.connect(myAccount).deploy();
  await myPlusCalculator.deployed();
  console.log(myPlusCalculator.address);

  console.log(await myPlusCalculator.plus(1, 2));

  const instance = "0x5304d3B1Dd3Eb81f28911296606e0620bC18aCD5"; // 이곳에 덧셈 문제 인스턴스 컨트랙트 주소를 넣으세요
  const PlusCalculatorProblem = await ethers.getContractFactory(
    "PlusCalculatorProblem"
  );
  const plusCalculatorProblem = PlusCalculatorProblem.attach(instance);
  plusCalculatorProblem
    .connect(myAccount)
    .setPlusCalculator(myPlusCalculator.address);
}

async function main() {
  calculatorSol();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
