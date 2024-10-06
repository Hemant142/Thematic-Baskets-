import React from "react";
import { Route, Routes } from "react-router-dom";
import RaDashboard from "../Pages/Research-Analyst/RaDashboard";
import CreateBasket from "../Pages/Research-Analyst/CreateBasket";
import RaLoginPage from "../Pages/Research-Analyst/RaLoginPage";
import RaHeadLoginPage from "../Pages/Research-Analyst-Head/RaHeadLoginPage";
import RaHeadDashboard from "../Pages/Research-Analyst-Head/RaHeadDashboard";
import RaHeadBasketDetails from "../Pages/Research-Analyst-Head/RaHeadBasketDetails";
import RaHeadPrivateRoute from "./RaHeadPrivateRoute";
import RaPrivateRoute from "./RaPrivateRoute"
import RaBasketDetails from "../Pages/Research-Analyst/RaBasketDetails";
import DealerLoginPage from "../Pages/Dealer/DealerLoginPage";
import DealerPrivateRoute from "./DealerPrivateRoute";
import DealerDashboard from "../Pages/Dealer/DealerDashboard";
import DealerBasketDetails from "../Pages/Dealer/DealerBasketDetails";
import LoginPage from "../Pages/Admin/LoginPage";
import AdminPrivateRoute from "./AdminPrivateRoute";
import Dashboard from "../Pages/Admin/Dashboard";
import AlgoList from "../Pages/Admin/AlgoList";
import SignalList from "../Pages/Admin/SignalList";
import CreateResearchAnalyst from "../Pages/Admin/CreateResearchAnalyst";
import ClientListAndDetails from "../Pages/Admin/ClientListAndDetails";
import BasketDetails from "../Pages/Admin/BasketDetails";
import AddDealerAndDealerList from "../Pages/Admin/AddDealerAndDealerList";
import NotFound from "../Pages/NotFound";
export default function AllRoutes() {
  return (
    <div>
      <Routes>
        
{/* <========================Ra Routes========================> */}
        <Route path="/ra" element={<RaLoginPage />} />
        <Route path="/ra/dashboard" element={<RaPrivateRoute><RaDashboard /></RaPrivateRoute>}/>
        <Route path="/ra/create-basket" element={<RaPrivateRoute><CreateBasket /></RaPrivateRoute>}/>
        <Route  path="/ra/basket-details/:id" element={<RaPrivateRoute><RaBasketDetails /></RaPrivateRoute>}/>

{/* <========================Ra Head Routes========================> */}
        <Route path="/rahead" element={<RaHeadLoginPage />} />
        <Route path="/rahead/dashboard" element={<RaHeadPrivateRoute> <RaHeadDashboard /></RaHeadPrivateRoute>}/>
        <Route path="/rahead/basket-details/:id" element={<RaHeadPrivateRoute><RaHeadBasketDetails /></RaHeadPrivateRoute>}/>


{/* <========================Dealer Routes========================> */}
        <Route path='/dealer' element={<DealerLoginPage/>}/>
        <Route path='/dealer/dashboard' element={<DealerPrivateRoute><DealerDashboard/></DealerPrivateRoute>}/>
        <Route path='/dealer/basket-details/:id' element={<DealerPrivateRoute><DealerBasketDetails/></DealerPrivateRoute>}/>
        
        
{/* <========================Admin Routes========================> */}

<Route path='/admin' element={<LoginPage/>}/>
            <Route path='/admin/dashboard' element={<AdminPrivateRoute><Dashboard/></AdminPrivateRoute>}/>
            <Route path='/admin/algolist' element={<AdminPrivateRoute><AlgoList/></AdminPrivateRoute>} />
            <Route path='/admin/signallist' element={<AdminPrivateRoute><SignalList/></AdminPrivateRoute>} />

            <Route path='/admin/addRA' element={<AdminPrivateRoute><CreateResearchAnalyst/></AdminPrivateRoute>}/>
            <Route path='/admin/clientsList' element={<AdminPrivateRoute><ClientListAndDetails/></AdminPrivateRoute>} />
            <Route path='/admin/basket-details/:id' element={<AdminPrivateRoute><BasketDetails/></AdminPrivateRoute>}/>
            <Route path='/admin/addDealer' element={<AdminPrivateRoute><AddDealerAndDealerList/></AdminPrivateRoute>} />
      
            <Route path='*' element={<NotFound/>}/>
      </Routes>
    </div>
  );
}
