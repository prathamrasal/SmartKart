const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

const metaDataTemplate = {
    name : "",
    description : "",
    image : "",
    attributes : [{
        trait_type : "Cuteness",
        value : 100,
    }]
}


module.exports = async({getNamedAccounts,deployments})=>{
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;
    const {log} = deployments;

    let tokenUris = [
        'ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4',
        'ipfs://QmcAYTohjhLJqrPjtasn6EbGDiYGPck1MGcFb5iL9ppnpQ',
        'ipfs://QmbvRqKSQxmNEHRY9o8Tzwvf1BoQb433kfkr5SLpKDgyiz'
      ]

      
    //create-Seller (Flipkart's job)
    const sellerContract = await ethers.getContract("Seller", deployer);
    console.log(`Seller contract created with address ${sellerContract.address}`)
    const sellerTxt = await sellerContract.createSeller("Ins", "INS", {gasLimit : "5000000"});
    
    // console.log(`Seller created with hash ${sellerTxt.hash}`);
    let contractAddress = '';
    const sellersWarrantyContractAddress = await sellerContract.getWarrantyContract({gasLimit : "5000000"});
    await new Promise((resolve,reject)=>{
        setTimeout(resolve, 600000) // 5 minute timeout time

        sellerContract.once('SellerCreated', async(e)=>{
            // console.log(sellersWarrantyContractAddress);
            contractAddress = e;
         
            console.log(e, 'Contract');
            console.log('Seller Created!');
            resolve();
        })
    })
   
    const sellerWarrantyContract = await ethers.getContractAt("WarrantyNFT", contractAddress,deployer);


    //buy deployer



    const mintTx = await sellerWarrantyContract.mintNftWithOrder(deployer,'123',tokenUris[0],tokenUris[1],'300', {gasLimit : "5000000"});
    await new Promise((resolve,reject)=>{
        setTimeout(resolve, 600000) // 5 minute timeout time
        sellerWarrantyContract.once('NFTMinted', (e)=>{
            console.log(e);
            console.log('NFT Created');
            console.log('NFT CREATED!!');
            resolve();
        })
    })
    if (developmentChains.includes(network.name)) {
    const txReciept = await mintTx.wait(1);
    const tokenId = await txReciept.events[1].args.tokenId;
    console.log(`Token Id For NFT is ${tokenId}`);
    }

}

