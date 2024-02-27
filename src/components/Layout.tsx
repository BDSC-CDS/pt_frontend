import { ReactNode, FunctionComponent } from 'react';

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
