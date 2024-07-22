import Link from "next/link";
import AuthWidget from "./AuthWidget";

export default function Header() {

    const logoStyle = {
        backgroundImage: `url('/sphn-logo-white.png')`
    };

    return (
        <>
            <header className="text-white bg-[#306278] h-14 fixed top-0 left-0 right-0 z-20">
                <nav className="flex">
                    <div className="flex items-center">
                        <div style={logoStyle} className="w-16 h-14 my-auto ml-10 m-2 bg-no-repeat bg-contain bg-center">
                        </div>
                        <p className="font-bold text-lg w-40">Privacy Toolbox</p>
                    </div>
                    <div className="container ml-[116px] mr-auto flex justify-between py-4 px-6 text-right gap-6 align-middle">
                        <div className="w-full gap-6 align-top text-sm">
                            <Link href="/" passHref className="ml-3">
                                <span className="px-3 py-2 hover:underline  rounded cursor-pointer">Home</span>
                            </Link>
                            <Link href="/about" passHref className="ml-4">
                                <span className="px-3 py-2 hover:underline  rounded cursor-pointer">About</span>
                            </Link>
                            <Link href="/contact" passHref className="ml-4">
                                <span className="px-3 py-2 hover:underline  rounded cursor-pointer">Contact</span>
                            </Link>
                            <AuthWidget />
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
};
