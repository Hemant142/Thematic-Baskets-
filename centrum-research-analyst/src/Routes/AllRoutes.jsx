import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from '../Pages/LoginPage'
import Dashboard from '../Pages/Dashboard'
import CreateBasket from '../Pages/CreateBasket'
import PrivateRoute from './PrivateRoute'
import BasketDetails from '../Pages/BasketDetails'

export default function AllRoutes() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<LoginPage/>}/>
            <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
            <Route path='/create-basket' element={<PrivateRoute><CreateBasket/></PrivateRoute>}/>
            <Route path='/basket-details/:id' element={<PrivateRoute><BasketDetails/></PrivateRoute>}/>
        </Routes>
    </div>
  )
}
