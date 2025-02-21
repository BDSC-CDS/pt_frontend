import { Footer } from 'flowbite-react';

const logoStyleSphn = {
    backgroundImage: `url('/sphn-logo-white.png')`
};
const logoStyleUsz = {
    backgroundImage: `url('/usz-logo-white.png')`
};
const logoStyleChuv = {
    backgroundImage: `url('/chuv-logo-white.png')`
};

export default function FooterMenu() {
    return (
        <Footer container className="fixed bottom-0 left-0 right-0 z-20 h-12 bg-[#306278] text-white rounded-none">
            <div className="w-full text-center">
                <div className="w-full justify-between  sm:flex sm:items-center sm:justify-between">

                    <Footer.LinkGroup>
                        <Footer.Link href="/" className='text-white'>Home</Footer.Link>
                        <Footer.Link href="/about" className='text-white'>About</Footer.Link>
                        <Footer.Link href="/contact" className='text-white'>Contact</Footer.Link>
                    </Footer.LinkGroup>
                    <div className='flex'>
                        <div style={logoStyleSphn} className="w-20 h-10 my-auto ml-6 m-2 bg-no-repeat bg-contain bg-center"></div>
                        <div style={logoStyleUsz} className="w-20 h-10 my-auto ml-6 m-2 bg-no-repeat bg-contain bg-center"></div>
                        <div style={logoStyleChuv} className="w-20 h-10 my-auto ml-6 m-2 bg-no-repeat bg-contain bg-center"></div>
                    </div>
                </div>
            </div>
        </Footer>
    );
}
