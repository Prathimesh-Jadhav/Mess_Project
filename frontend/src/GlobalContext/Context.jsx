import React, { useState } from 'react'

export const MessContext = React.createContext()

const Context = ({children}) => {
    const [role,setRole] = React.useState('user')
    const [isLogin,setIsLogin] = React.useState(false)  

  return (
    <MessContext.Provider value={{role,setRole,isLogin,setIsLogin}}>
       {children}
    </MessContext.Provider>
  )
}

export default Context
