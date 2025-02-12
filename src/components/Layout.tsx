import { ReactNode, FunctionComponent } from 'react';

import Header from "../components/Header";
import FooterMenu from "../components/Footer";
import SideMenu from "../components/SideMenu";

import { AuthProvider } from '../utils/authContext';
import { Toaster } from 'react-hot-toast';


type Props = {
    children: ReactNode;
};


export const Layout: FunctionComponent<Props> = ({ children }) => {
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"/>

            <AuthProvider>
                <div className="min-h-screen">
                    <Header />
                    <Toaster position="top-right" containerClassName="fixed top-15 right-2"/>
                    <div className="flex h-screen pt-14 pb-12">
                        <SideMenu />
                        <main className="flex-1 px-10 py-5 overflow-x-auto">
                            {children}
                        </main>
                    </div>
                    <FooterMenu />
                </div>
            </AuthProvider>
        </>
    );
}
