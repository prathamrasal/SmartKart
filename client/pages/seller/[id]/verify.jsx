import React, { useEffect } from "react";
import SellerPanelLayout from "../../../components/Seller/SellerPanelLayout";
import { verifyAuthentication } from "../../../utils/verifyAuth";
import { ConnectButton } from "web3uikit";
import { Form, useNotification, Button } from "web3uikit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import SellerContractABI from "../../../constants/SellerABI.json";
import { sellerAddress } from "../../../constants/sellerAddresses";
import { useDispatch } from "react-redux";
import { setSellerVerification } from "../../../store/auth/actions";
export const getServerSideProps = async (ctx) => {
  const auth = verifyAuthentication(ctx.req);
  if (auth.state && auth.decodedData.user.role === "seller") {
    return { props: { user: auth.decodedData.user } };
  }
  return {
    redirect: {
      destination: "/auth",
    },
  };
};

//   dispatch({
//     type: "success",
//     message: "NFT listing",
//     title: "NFT listed",
//     position: "topR",
// })

const Verify = ({ user }) => {

  const dispatch = useNotification();
  const { account, isWeb3Enabled, isWeb3EnableLoading, chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "1337";
  const reduxDispatch = useDispatch();
  const { runContractFunction: createSeller } = useWeb3Contract({
    abi: SellerContractABI,
    contractAddress: sellerAddress[chainString],
    functionName: "createSeller",
    params: {
      NFTName: "Gada Electronics",
      NFTSymbol: "GE",
    },
  });
  
  const { runContractFunction: getWarrantyContract } = useWeb3Contract({
    abi: SellerContractABI,
    contractAddress: sellerAddress[chainString],
    functionName: "getWarrantyContract",
  });

  const handleSave = async () => {
    const handleSuccess = (e) => {
      console.log(e);
      dispatch({
        type: "success",
        message: "Seller created successfully!",
        title: "Seller Creation",
        position: "topR",
      });
    };
    const handleSuccessWarranty = (e) => {
      console.log(e, "Handlesuccesswarranty");
      reduxDispatch(setSellerVerification({warrantyAddress : e, sellerAddress : account},dispatch));
      dispatch({
        type: "success",
        message: "Warranty Contract created!",
        title: "Warranty Contract",
        position: "topR",
      });
    };
    const handleErrorWarranty = (e) => {
      console.log(e);
      dispatch({
        type: "error",
        message: "Something went wrong!",
        title: "Warranty Contract",
        position: "topR",
      });
    };
    const handleError= (e) => {
      console.log(e,'Handle error');
      dispatch({
        type: "error",
        message: "Something went wrong!",
        title: "Create Seller",
        position: "topR",
      });
    };

    if (isWeb3Enabled) {
      try {
        const result = await createSeller({
          onSuccess: handleSuccess,
          onError: handleError,
        });
        const warrantyContract = await getWarrantyContract({
          onSuccess: handleSuccessWarranty,
          onError: handleErrorWarranty,
        });
        console.log(warrantyContract);
        console.log(result);
        console.log(result.events);
      } catch (err) {
        console.log(err);
      }
    } else {
      dispatch({
        type: "error",
        message: "Your Wallet is not connected",
        title: "Connection Error",
        position: "topR",
      });
    }
  };
  return (
    <SellerPanelLayout>
      {user.isSellerVerified ? (
        <div className="p-7 flex justify-center items-center flex-col">
          <div className="text-3xl font-semibold text-green-600"><span className="animate-pulse duration-300 transition-all">🟢</span>Seller Active</div>
          <div className="mt-7">
            <div className="flex  gap-10 w-fit">
              <div className="font-semibold text-gray-600">Warranty Address : </div>
              <div className="font-semibold text-gray-900">{user.warrantyAddress}</div>
            </div>
            <div className="flex  gap-10 w-fit mt-5">
              <div className="font-semibold text-gray-600">Seller Address : </div>
              <div className="font-semibold text-gray-900">{user.sellerAddress}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 flex justify-center items-center flex-col">
          <div className="text-3xl font-semibold">Verify Seller</div>
          <div className="w-[50px] h-[6px] bg-flipkartBlue mt-3"></div>
          <div className="mt-6">
            <ConnectButton moralisAuth={false} />
          </div>
          <div className="mt-5">
            <button
              onClick={handleSave}
              className="bg-flipkartBlue text-white px-6 py-1 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </SellerPanelLayout>
  );
};

export default Verify;
