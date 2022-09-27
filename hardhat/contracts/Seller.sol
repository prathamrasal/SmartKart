//SPDX-License-Identifier: MIT

pragma solidity^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./WarrantyNFT.sol";

error Seller_SellerAlreadyExists();
error Seller_sellerDoesntExists();

library Library {
  struct data {
     WarrantyNFT WarrantyContract;
     bool isValue;
   }
}

contract Seller{
 using Library for Library.data;
  mapping(address => Library.data) public sellers;




    
    event SellerCreated(address indexed warrantyContractAddress); 
    

    function createSeller(string memory NFTName, string memory NFTSymbol) public returns(WarrantyNFT){
        // if (sellers[msg.sender].isValue) {
        //     revert Seller_SellerAlreadyExists();
        // }

            WarrantyNFT newContract =  new WarrantyNFT(msg.sender, NFTName,NFTSymbol);
            sellers[msg.sender].WarrantyContract = newContract;
            sellers[msg.sender].isValue = true;
            emit SellerCreated(address(newContract));
            return sellers[msg.sender].WarrantyContract;
    }

    function getWarrantyContract() public view returns (WarrantyNFT) {
        // if (!sellers[address(msg.sender)].isValue) {
        //     revert Seller_sellerDoesntExists();
        // }
        return sellers[msg.sender].WarrantyContract;

    }

    // function mintWarrantyContract(address warrantyContractAddress,address seller, uint256 orderId, string memory tokenURI, string memory expireTokenURI, string memory expiryDate) public returns(uint256) {
    //     require(!sellers[seller].isValue,"Seller was not found!");
    //     console.log(address(sellers[seller].WarrantyContract));
    //     WarrantyNFT fetchedWarrantyContract = WarrantyNFT(warrantyContractAddress);
    //     uint256 tokenId = fetchedWarrantyContract.mintWarrantyNFT(address(msg.sender),orderId,tokenURI,expireTokenURI,expiryDate);
    //     return tokenId;
    // }

    // function placeOrder(address warrantyContractAddress,uint256 orderId) public {
    //     WarrantyNFT fetchedWarrantyContract = WarrantyNFT(address(warrantyContractAddress));
    //     fetchedWarrantyContract.placeOrder(address(msg.sender),orderId);
    // }




}



