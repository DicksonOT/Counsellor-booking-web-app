import { createContext } from "react";
import axios from 'axios'
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { reviews, team} from "../assets/assets";


export const AppContext = createContext()

const AppContextProvider = (props) => { 
    const [counsellors, setCounsellors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)


    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const service_id = import.meta.env.VITE_SERVICE_ID
    const template_id = import.meta.env.VITE_TEMPLATE_ID
    const public_key = import.meta.env.VITE_PUBLIC_KEY

    const currencySymbol= 'GH₵ '

    const getUserInfo = async () =>{
        try {

            const {data} = await axios.get(`${backendUrl}/api/user/info`, {headers: {token}})

            if (data.success){
                setUserData(data.userData)
            } else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getCounsellors = async () =>{
        try {
            const {data} = await axios.get (`${backendUrl}/api/counsellor/list`)

            if(data.success){
                setCounsellors(data.counsellors)
            } 
            
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value =  { 
        counsellors, currencySymbol, reviews, backendUrl, setToken, token, team, userData, setUserData, getUserInfo, getCounsellors, service_id, template_id, public_key
    }
    
    useEffect(()=>{
        getCounsellors()
    }, [])

    useEffect(()=>{
        if(token){
            getUserInfo()
        } else {
            setUserData(false)
        }
    }, [token])

     return(
        <AppContext.Provider value= {value}>
             { props.children }
        </AppContext.Provider>
     )

} 

export default AppContextProvider