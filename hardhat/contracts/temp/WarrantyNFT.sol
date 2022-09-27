//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
error WarrantyNFT__alreadyExists();
error WarrantyNFT__orderNotFound();
error WarrantyNFT__AlreadyIssuedNFT();
error WarrantyNFT__UpkeepNotNeeded();

contract WarrantyNFTTest is ERC721URIStorage, KeeperCompatibleInterface {
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

    //see if some order already has issed warranty NFT;
    mapping(uint256 => uint256) private issuedNFT;

    function placeOrder(uint256 orderId) public {
        bool isOrderExists = isExistsInArray(
            customerToOrders[msg.sender],
            orderId
        );
        if (isOrderExists) {
            revert WarrantyNFT__alreadyExists();
        }
        customerToOrders[msg.sender].push(orderId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return NftTokenToData[tokenId].tokenURI;
    }

    function mintWarrantyNFT(
        address customer,
        uint256 orderId,
        string memory tokenURI,
        string memory expireTokenURI,
        uint256 expiry
    ) public onlyCustomer {
        bool isOrderExists = isExistsInArray(
            customerToOrders[customer],
            orderId
        );
        if (!isOrderExists) {
            revert WarrantyNFT__orderNotFound();
        }
        if (issuedNFT[orderId] != 0) {
            revert WarrantyNFT__AlreadyIssuedNFT();
        }
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(customer, newItemId);
        _setTokenURI(newItemId, tokenURI);
        NftTokenToData[newItemId] = NftTokenData({
            tokenId: newItemId,
            expiry: expiry,
            tokenURI: tokenURI,
            expireTokenURI: expireTokenURI,
            timeStamp: block.timestamp,
            expired: false
        });
        issuedNFT[orderId] = newItemId;
        emit NFTMinted(newItemId, customer);
    }

   function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        uint256 currentId = 1;
         NftTokenData memory currentData = NftTokenToData[currentId];
        // for (uint256 i = 1; i < currentId; ++i) {
        //     NftTokenData memory currentData = NftTokenToData[i];
        //     if (currentData.expired) {
        //         bool timePassed = ((block.timestamp - currentData.timeStamp) >
        //             currentData.expiry);
        //         if (timePassed) {
        //             return (upkeepNeeded, "0x0");
        //         }
        //     }
        // }
        // return (false, "0x0");
          bool timePassed = ((block.timestamp - currentData.timeStamp) > currentData.expiry);
            if (timePassed) {
                    return (true, "0x0");
            }
            return (false, "0x0");
        

        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

     function performUpkeep(bytes calldata /*performData*/) external override {
        (bool upkeepNeeded,) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert WarrantyNFT__UpkeepNotNeeded();
        }
        // uint256 currentId = _tokenIds.current();
        // for (uint256 i = 1; i < currentId; ++i) {
        //     NftTokenData memory currentData = NftTokenToData[i];
        //     if (currentData.expired) {
        //         bool timePassed = ((block.timestamp - currentData.timeStamp) >
        //             currentData.expiry);
        //         if (timePassed) {
        //            _setTokenURI(i, currentData.expireTokenURI);
        //         }
        //     }
           
        // }
         NftTokenData memory currentData = NftTokenToData[1];
            if (!currentData.expired) {
                bool timePassed = ((block.timestamp - currentData.timeStamp) > currentData.expiry);
                if (timePassed) {
                   _setTokenURI(1, currentData.expireTokenURI);
                   NftTokenToData[1].expired = true;
                }
            }
     }

    modifier onlyCustomer() {
        require(
            customerToOrders[msg.sender].length > 0,
            "Not Allowed, You are not customer"
        );
        _;
    }
}
