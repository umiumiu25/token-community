// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract TokenBank {
  // Tokenの名前
  string private _name;

  // Tokenのシンボル
  string private _symbol;

  // Tokenの総供給数
  uint256 constant _totalSupply = 1000;

  // TokenBankが預かっているTokenの総額
  uint256 private _bankTotalDeposite;

  // TokenBankのオーナー
  address public owner;

  // アカウントアドレス毎のTokenBankが預けたToken数
  mapping(address => uint256) private _balances;

  // アカウントアドレス毎のTokenBankが預かっているToken数
  mapping(address => uint256) private _tokenBankBalanaces;
}
