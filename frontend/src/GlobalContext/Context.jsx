import React, { useState } from 'react'

export const MessContext = React.createContext()

const Context = ({children}) => {
  const [mealRate, setMealRate] = useState(0);
  const [adminDetails, setAdminDetails] = useState({})
  const [isLogin, setIsLogin] = useState(sessionStorage.getItem('token') !=''|| false);
  const [role, setRole] = useState(sessionStorage.getItem('role'));

  return (
    <MessContext.Provider value={{
      mealRate,
      setMealRate,
      adminDetails,
      setAdminDetails,
      isLogin,
      setIsLogin,
      role,
      setRole
    }}>
       {children}
    </MessContext.Provider>
  )
}

export default Context
