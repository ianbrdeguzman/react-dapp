//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20Token is ERC20 {
  constructor() ERC20('MyERC20Token','MET') {
    _mint(msg.sender, 100000 * (10 ** 18));
  }
}