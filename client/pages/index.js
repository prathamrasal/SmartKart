import { useEffect } from "react";
import { fetchAllProductsAPI } from "../APIs/products";
import FilterComponent from "../components/FilterBar/FilterComponent";
import Filters from "../components/FilterBar/Filters";
import Header from "../components/Header";
import ProductsContainer from "../components/Products/ProductsContainer";
import { setAuthDetails } from "../store/auth/actions";
import { verifyAuthentication } from '../utils/verifyAuth';

import { useDispatch } from "react-redux";
export const getServerSideProps = async(ctx) => {
  const auth = verifyAuthentication(ctx.req);
  try {
  const products = await fetchAllProductsAPI();
  return {
    props : {
      products : products.data.products,
      user : auth.state?auth.decodedData.user:{}
    }
  }
  }catch(err) {
    console.log(err);
    return {
      notFound : true
    }
  }


  
};

export default function Home({products,user}) {
  const dispatch = useDispatch();
  console.log(products);
  useEffect(()=>{
    if (user) {
      dispatch(setAuthDetails({isLoggedin : true,user : user}));
    }
  }, []);
  return (
    <div>
      <Header/>
      <div className="grid grid-cols-[0.22fr_0.8fr] gap-x-4 p-4">
          <Filters/>
          <ProductsContainer products={products}/>
      </div>
    </div>
  )
}