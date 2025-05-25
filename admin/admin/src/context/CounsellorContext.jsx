import { createContext, useState } from "react";


export const CounsellorContext = createContext()

const CounsellorContextProvider = (props) => {
    const [cToken,setCToken] = useState(localStorage.getItem('cToken') ?localStorage.getItem('cToken') :'')
    const backendUrl= import.meta.env.VITE_BACKEND_URL
    const value = {
        cToken,setCToken, backendUrl
    }

    return(
        <CounsellorContext.Provider value={value}>
            {props.children}
        </CounsellorContext.Provider>
    )
}

export default CounsellorContextProvider