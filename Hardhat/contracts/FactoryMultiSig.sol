// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


import "@openzeppelin/contracts/utils/Create2.sol";

import "./MetaMultiSig.sol";

//custom errors
error CALLER_NOT_REGISTERED();

contract MultiSigFactory {
    MetaMultiSig[] public multiSigs;
    mapping(address => bool) existsMultiSig;

    event Create2Event(
        uint256 indexed contractId,
        string name,
        address indexed contractAddress,
        address creator,
        address[] owners,
        uint256 signaturesRequired
    );


    event Owners(
        address indexed contractAddress,
        address[] owners,
        uint256 indexed signaturesRequired
    );
    event ExecutedTransaction(
        address indexed multiSig,
        address indexed executor,
        address  to,
        uint256 value,
        bytes data,
        uint256 nonce,
        bytes32 hash,
        bytes result
    );

    modifier onlyRegistered() {
        if (!existsMultiSig[msg.sender]) {
            revert CALLER_NOT_REGISTERED();
        }
        _;
    }

    function emitOwners(
        address _contractAddress,
        address[] calldata _owners,
        uint256 _signaturesRequired
    ) external onlyRegistered {
        emit Owners(_contractAddress, _owners, _signaturesRequired);
    }
    function emitExectuedTransaction(
        address executor,
        address to,
        uint256 value,
        bytes calldata data,
        uint256 nonce,
        bytes32 hash,
        bytes calldata result) external onlyRegistered{
            emit ExecutedTransaction(msg.sender,executor, to,value,data,nonce,hash,result);
        }

    function numberOfMultiSigs() public view returns (uint256) {
        return multiSigs.length;
    }
    // function emitDeposit(address  sender, uint256 amount, uint256 balance)onlyRegistered external{
    //     emit Deposit(msg.sender,sender,amount,balance);
    // }

    function getMultiSig(uint256 _index)
        public
        view
        returns (
            address multiSigAddress,
            uint256 signaturesRequired,
            uint256 balance
        )
    {
        MetaMultiSig multiSig = multiSigs[_index];
        return (
            address(multiSig),
            multiSig.signaturesRequired(),
            address(multiSig).balance
        );
    }

    function create2(
        address[] calldata _owners,
        uint256 _signaturesRequired,
        string calldata _name
    ) public payable {
        uint256 id = numberOfMultiSigs();

        bytes32 _salt = keccak256(
            abi.encodePacked(abi.encode(_name, address(msg.sender)))
        );

        /**----------------------
         * create2 implementation
         * ---------------------*/
        address multiSig_address = payable(
            Create2.deploy(
                msg.value,
                _salt,
                abi.encodePacked(
                    type(MetaMultiSig).creationCode,
                    abi.encode(_name, address(this))
                )
            )
        );

        MetaMultiSig multiSig = MetaMultiSig(payable(multiSig_address));

        /**----------------------
         * init remaining values
         * ---------------------*/
        multiSig.init(_owners, _signaturesRequired);

        multiSigs.push(multiSig);
        existsMultiSig[address(multiSig_address)] = true;

        emit Create2Event(
            id,
            _name,
            address(multiSig),
            msg.sender,
            _owners,
            _signaturesRequired
        );
        emit Owners(address(multiSig), _owners, _signaturesRequired);
    }

    /**----------------------
     * get a pre-computed address
     * ---------------------*/
    function computedAddress(string calldata _name)
        public
        view
        returns (address)
    {
        bytes32 bytecodeHash = keccak256(
            abi.encodePacked(
                type(MetaMultiSig).creationCode,
                abi.encode(_name, address(this))
            )
        );

        bytes32 _salt = keccak256(
            abi.encodePacked(abi.encode(_name, address(msg.sender)))
        );
        address computed_address = Create2.computeAddress(_salt, bytecodeHash);

        return computed_address;
    }
}