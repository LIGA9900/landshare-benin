// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract LandShareAnchor {

    address public owner;

    struct Anchor {
        string  investRef;
        string  docHash;
        string  terrain;
        string  city;
        uint256 amount;
        uint256 sqm;
        uint256 anchoredAt;
        bool    exists;
    }

    mapping(string => Anchor) private anchors;
    string[] public allRefs;

    event AnchorCreated(
        string  indexed investRef,
        string  docHash,
        string  terrain,
        string  city,
        uint256 amount,
        uint256 sqm,
        uint256 anchoredAt
    );

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "LandShare: not the owner");
        _;
    }

    modifier notExists(string memory investRef) {
        require(!anchors[investRef].exists, "LandShare: already anchored");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // Ancrer un investissement sur la blockchain
    function anchor(
        string memory investRef,
        string memory docHash,
        string memory terrain,
        string memory city,
        uint256 amount,
        uint256 sqm
    ) external onlyOwner notExists(investRef) {
        require(bytes(investRef).length > 0, "LandShare: empty ref");
        require(bytes(docHash).length  > 0,  "LandShare: empty hash");
        require(sqm > 0,                      "LandShare: sqm must be > 0");

        uint256 ts = block.timestamp;

        anchors[investRef] = Anchor({
            investRef:  investRef,
            docHash:    docHash,
            terrain:    terrain,
            city:       city,
            amount:     amount,
            sqm:        sqm,
            anchoredAt: ts,
            exists:     true
        });

        allRefs.push(investRef);
        emit AnchorCreated(investRef, docHash, terrain, city, amount, sqm, ts);
    }

    // Vérifier par référence
    function verify(string memory investRef) external view returns (
        bool    found,
        string  memory docHash,
        string  memory terrain,
        string  memory city,
        uint256 amount,
        uint256 sqm,
        uint256 anchoredAt
    ) {
        Anchor memory a = anchors[investRef];
        if (!a.exists) return (false, "", "", "", 0, 0, 0);
        return (true, a.docHash, a.terrain, a.city, a.amount, a.sqm, a.anchoredAt);
    }

    // Vérifier par hash SHA-256
    function verifyByHash(string memory docHash) external view returns (
        bool    found,
        string  memory investRef,
        string  memory terrain,
        uint256 sqm,
        uint256 anchoredAt
    ) {
        for (uint256 i = 0; i < allRefs.length; i++) {
            Anchor memory a = anchors[allRefs[i]];
            if (keccak256(bytes(a.docHash)) == keccak256(bytes(docHash))) {
                return (true, a.investRef, a.terrain, a.sqm, a.anchoredAt);
            }
        }
        return (false, "", "", 0, 0);
    }

    function totalAnchors() external view returns (uint256) {
        return allRefs.length;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "LandShare: zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
