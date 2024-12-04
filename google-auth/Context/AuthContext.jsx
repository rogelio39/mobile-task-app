import { createContext, useContext } from "react";
import PropTypes from 'prop-types';
import { Login } from "../Services/Api";




const AuthContext = createContext();


export const useAuthContext = () =>  useContext(AuthContext);


export const AuthProvider = ({ children }) => {

    const handleSuccess = async (token) => {

        const loginSucess = await Login(token);
        console.log("loginsucess context", loginSucess)
        if(loginSucess){
            return loginSucess
        }
    };



    return (
        <AuthContext.Provider value={{handleSuccess}}>
            {children}
        </AuthContext.Provider>
    )

}





AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
}

