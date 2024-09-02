import Link from "next/link";
import AuthWidget from "./AuthWidget";

export default function Header() {

    const logoStyle = {
        backgroundImage: `url('/sphn-logo-white.png')`
    };

    return (
        <>
            <header className="text-white bg-[#306278] h-14 fixed top-0 left-0 right-0 z-20">
                <nav className="flex justify-between items-center h-full">
                    <div className="flex items-center">
                        <div style={logoStyle} className="w-16 h-14 my-auto ml-10 m-2 bg-no-repeat bg-contain bg-center"></div>
                        <p className="font-bold text-lg w-40">Privacy Toolbox</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm mr-6">
                        <Link href="/" passHref>
                            <span className="px-3 py-2 hover:underline rounded cursor-pointer">Home</span>
                        </Link>
                        <Link href="/about" passHref>
                            <span className="px-3 py-2 hover:underline rounded cursor-pointer">About</span>
                        </Link>
                        <Link href="/contact" passHref>
                            <span className="px-3 py-2 hover:underline rounded cursor-pointer">Contact</span>
                        </Link>
                        <AuthWidget />
                    </div>
                </nav>
            </header>

            {/* <header className="text-white bg-[#306278] h-14 fixed top-0 left-0 right-0 z-20 ">
                <nav className="flex">
                    <div className="flex items-center">
                        <div style={logoStyle} className="w-16 h-14 my-auto ml-10 m-2 bg-no-repeat bg-contain bg-center"></div>
                        <p className="font-bold text-lg w-40">Privacy Toolbox</p>
                    </div>
                    <div className="container flex justify-between py-4 px-6 text-right gap-6 align-middle">
                        <div className="w-full gap-6 align-top text-sm">
                            <Link href="/" passHref>
                                <span className="px-3 py-2 hover:underline rounded cursor-pointer">Home</span>
                            </Link>
                            <Link href="/about" passHref>
                                <span className="px-3 py-2 hover:underline rounded cursor-pointer">About</span>
                            </Link>
                            <Link href="/contact" passHref>
                                <span className="px-3 py-2 hover:underline rounded cursor-pointer">Contact</span>
                            </Link>
                            <AuthWidget />
                        </div>
                    </div>
                </nav>
            </header> */}

        </>
    )
};
