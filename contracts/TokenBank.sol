// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface MemberToken {
    function balanceOf(address owner) external view returns (uint256);
}

contract TokenBank {
    MemberToken public memberToken;

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
    event TokenTransfer(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    /// @dev Token預入時のイベント
    event TokenDeposit(address indexed from, uint256 amount);

    /// @dev Token引出時のイベント
    event TokenWithdraw(address indexed from, uint256 amount);

    constructor(
        string memory name_,
        string memory symbol_,
        address nftContract_
    ) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
        _balances[owner] = _totalSupply;
        memberToken = MemberToken(nftContract_);
    }

    /// @dev NFTメンバーのみ
    modifier onlyMember() {
        require(memberToken.balanceOf(msg.sender) > 0, "not NFT member");
        _;
    }

    /// @dev オーナー以外
    modifier notOwner() {
        require(msg.sender != owner, "Owner cannot execute");
        _;
    }

    /// @dev Tokenの名前を返す
    function name() public view returns (string memory) {
        return _name;
    }

    /// @dev Tokenのシンボルを返す
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /// @dev Tokenの総供給数を返す
    function totalSupply() public pure returns (uint256) {
        return _totalSupply;
    }

    /// @dev 指定アカウントアドレスのToken残高を返す
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    /// @dev Tokenを移転する
    function transfer(address to, uint256 amount) public onlyMember {
        if (msg.sender == owner) {
            require(
                _balances[owner] - _bankTotalDeposit >= amount,
                "Amounts greater than the total supply cannot be transferred"
            );
        }
        address from = msg.sender;
        _transfer(from, to, amount);
    }

    /// @dev 実際の移転処理
    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "Zero address cannot be specified for 'to'!");
        // uint256 fromBalance = _balances[from];

        require(_balances[from] >= amount, "Insufficient balance!");

        // _balances[from] = fromBalance - amount;
        _balances[from] -= amount;
        _balances[to] += amount;

        emit TokenTransfer(from, to, amount);
    }

    /// @dev TokenBankが預かっているTokenの総額を返す
    function bankTotalDeposit() public view returns (uint256) {
        return _bankTotalDeposit;
    }

    /// @dev TokenBankが預かっている指定のアカウントアドレスのToken数を返す
    function bankBalanceOf(address account) public view returns (uint256) {
        return _tokenBankBalanaces[account];
    }

    /// @dev Tokenを預ける
    function deposit(uint256 amount) public onlyMember notOwner {
        address from = msg.sender;
        address to = owner;
        _transfer(from, to, amount);

        _tokenBankBalanaces[from] += amount;
        _bankTotalDeposit += amount;

        emit TokenDeposit(from, amount);
    }

    /// @dev Tokenを引き出す
    function withdraw(uint256 amount) public onlyMember notOwner {
        address from = owner;
        address to = msg.sender;
        uint256 toTokenBankBalance = _tokenBankBalanaces[to];
        require(
            amount <= toTokenBankBalance,
            "An amount greater than your tokenBank balance!"
        );
        _transfer(from, to, amount);
        _tokenBankBalanaces[to] -= amount;
        _bankTotalDeposit -= amount;

        emit TokenWithdraw(to, amount);
    }
}
