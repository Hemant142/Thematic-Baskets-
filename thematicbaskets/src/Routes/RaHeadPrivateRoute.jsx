import React from 'react'
import Cookies from 'cookies-js';

import { Navigate, useLocation } from 'react-router-dom';

export default function RaHeadPrivateRoute({children}) {
    let token = Cookies.get("login_token_rh");
    const location = useLocation();
    return !token?<Navigate to="/rahead" state={location.pathname} replace={true}/>:children
}
