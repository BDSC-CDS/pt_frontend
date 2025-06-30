import Link from "next/link";
import Image from 'next/image';

import AuthWidget from "./AuthWidget";

export default function Header() {

    return (
        <>
            <header className="text-white  h-14 fixed top-0 left-0 right-0 z-20 header-bg">
                <nav className="flex justify-between items-center h-full">
                    <Link href="/">
                        <div className="flex items-center">
                            <Image
                                src="/logo.png"
                                alt="Privacy Toolbox Logo"
                                width={128}
                                height={44}
                                className="h-11 w-auto min-w-8 max-w-28 my-auto ml-5 m-2"
                            />
                            {/* <div 
                                style={logoStyle} 
                                className="h-14 w-auto min-w-8 max-w-32 my-auto ml-5 m-2 bg-no-repeat bg-contain bg-center"
                            /> */}
                            <p className="font-bold text-lg w-40">Privacy Toolbox</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-6 text-sm mr-6">
                        <Link href="/" passHref>
                            <span className="px-3 py-2 hover:underline rounded cursor-pointer">Home</span>
                        </Link>
                        {/* <Link href="/about" passHref>
                            <span className="px-3 py-2 hover:underline rounded cursor-pointer">About</span>
                        </Link> */}
                        <Link href="/contact" passHref>
                            <span className="px-3 py-2 hover:underline rounded cursor-pointer">Contact</span>
                        </Link>
                        <AuthWidget />
                    </div>
                </nav>
            </header>
        </>
    )
};
