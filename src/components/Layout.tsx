import { ReactNode, FunctionComponent } from 'react';

import Header from "../components/Header";
import FooterMenu from "../components/Footer";
import SideMenu from "../components/SideMenu";

import { AuthProvider } from '../utils/authContext';


type Props = {
    children: ReactNode;
};


export const Layout: FunctionComponent<Props> = ({ children }) => {
    return (
        <div className=' bg-white'>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet"></link>
            <AuthProvider>
                <Header />
                <SideMenu />
                <div className='h-14'></div>
                <main className="ml-[280px] flex-1 flex flex-col container mr-auto">
                    {children}
                </main>
                <div className='h-14'></div>
                <FooterMenu />
            </AuthProvider>

        </div>
    );
}
