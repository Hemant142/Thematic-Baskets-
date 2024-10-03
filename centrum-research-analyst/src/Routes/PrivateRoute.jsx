import React from 'react'
import Cookies from 'cookies-js';

import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({children}) {
    let token = Cookies.get("login_token_ra");
    const location = useLocation();
    return !token?<Navigate to="/" state={location.pathname} replace={true}/>:children
}
