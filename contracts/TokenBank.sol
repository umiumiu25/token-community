// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract TokenBank {
    /// @dev Tokenの名前
    string private _name;

    /// @dev Tokenのシンボル
    string private _symbol;

    /// @dev Tokenの総供給数
    uint256 constant _totalSupply = 1000;

    /// @dev TokenBankが預かっているTokenの総額
    uint256 private _bankTotalDeposit;

    /// @dev TokenBankのオーナー
    address public owner;

    /// @dev アカウントアドレス毎のTokenBankが付与したToken数
    mapping(address => uint256) private _balances;

    /// @dev アカウントアドレス毎のTokenBankが預かっているToken数
    mapping(address => uint256) private _tokenBankBalanaces;

    /// @dev Token移転時のイベント
    event TokenTransfar(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    /// @dev Token預入時のイベント
    event TokenDeposit(address indexed from, uint256 amount);

    /// @dev Token引出時のイベント
    event TokenWithdraw(address indexed from, uint256 amount);
}
