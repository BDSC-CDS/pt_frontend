import {  ReactNode, FunctionComponent } from 'react';

import Header from "../components/Header";
import FooterMenu from "../components/Footer";
import SideMenu from "../components/SideMenu";

import { AuthProvider } from '../utils/AuthContext';


type Props = {
    children: ReactNode;
};


export const Layout: FunctionComponent<Props> = ({ children }) => {
    return (
    <div className=' bg-white'>

        <AuthProvider>
            <Header/>
            <SideMenu />
                <main>{children}</main>
            <FooterMenu />
        </AuthProvider>

    </div>
    );
}
