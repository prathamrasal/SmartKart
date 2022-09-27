//SPDX-License-Identifier: MIT



pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
error WarrantyNFT__alreadyExists();
error WarrantyNFT__orderNotFound();
error WarrantyNFT__AlreadyIssuedNFT();
error WarrantyNFT__UpkeepNotNeeded();

contract WarrantyNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    struct NftTokenData {
        uint256 tokenId;
        uint256 expiry;
        string tokenURI;
        string expireTokenURI;
        uint256 timeStamp;
        bool expired;
    }

    event NFTMinted(uint256 tokenId, address owner);

    //every seller is has a unique minter;
    address private immutable i_sellerId;

    constructor(
        address sellerId,
        string memory NFTName,
        string memory NFTSymbol
    ) ERC721(NFTName, NFTSymbol) {
        i_sellerId = sellerId;
    }

    function isExistsInArray(uint256[] memory array, uint256 key)
        internal
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < array.length; ++i) {
            if (array[i] == key) {
                return true;
            }
        }
        return false;
    }

    //mapping of order to customer orders array;
    mapping(address => uint256[]) private customerToOrders;

    //mapping for NFT Data;
    mapping(uint256 => NftTokenData) public NftTokenToData;

    //customerAddressToNFTTokens;
    mapping(address=>uint256[]) CustomerAddressToTokens;

    //see if some order already has issed warranty NFT;
    mapping(uint256 => uint256) private issuedNFT;

    function mintNftWithOrder(address customer,uint256 orderId, string memory activeTokenURI, string memory expireTokenURI, uint256 expiry) public {
        bool isOrderExists = isExistsInArray(
            customerToOrders[customer],
            orderId
        );
        if (isOrderExists) {
            revert WarrantyNFT__alreadyExists();
        }
        customerToOrders[customer].push(orderId);
        if (issuedNFT[orderId] != 0) {
            revert WarrantyNFT__AlreadyIssuedNFT();
        }
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(customer, newItemId);
        NftTokenToData[newItemId] = NftTokenData({
            tokenId: newItemId,
            expiry: expiry,
            tokenURI: activeTokenURI,
            expireTokenURI: expireTokenURI,
            timeStamp: block.timestamp,
            expired: false
        });
        issuedNFT[orderId] = newItemId;
        CustomerAddressToTokens[customer].push(newItemId);
        emit NFTMinted(newItemId, customer);

    }

    function getCustomerOrders() public view returns(uint256[] memory){
        return customerToOrders[msg.sender];
    }
    
 

   function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        NftTokenData memory currentData = NftTokenToData[tokenId];
        bool timePassed = ((block.timestamp - currentData.timeStamp) > currentData.expiry);
        if (timePassed) {
            return currentData.expireTokenURI;
        }
        else {
            return currentData.tokenURI;
        }
   }



 

    function getCustomersTokens() public view returns(string[] memory){
        uint256[] memory customerNFTTokens = CustomerAddressToTokens[msg.sender];
        string[] memory tokenURIs = new string[](customerNFTTokens.length);
        for(uint256 i=0; i<customerNFTTokens.length; ++i) {
            tokenURIs[i] = tokenURI(customerNFTTokens[i]);
        }
        return tokenURIs;
    }

    function getTokenDetailsFromOrderId(uint256 orderId) public view returns(uint256) {
        if (issuedNFT[orderId] == 0) {
            revert WarrantyNFT__orderNotFound();
        }
        uint256 tokenId = issuedNFT[orderId];
        return tokenId;
    }

   

    modifier onlyCustomer() {
        require(
            customerToOrders[msg.sender].length > 0,
            "Not Allowed, You are not customer"
        );
        _;
    }
}
