import { Footer } from 'flowbite-react';

const logoStyleSphn = {
    backgroundImage: `url('/sphn-logo.png')`
};
const logoStyleUsz = {
    backgroundImage: `url('/usz-logo.png')`
};
const logoStyleChuv = {
    backgroundImage: `url('/chuv-logo.png')`
};

export default function FooterMenu() {
    return (
        <Footer container className="fixed bottom-0 left-0 right-0 z-20 h-14">
            <div className="w-full text-center">
                <div className="w-full justify-between  sm:flex sm:items-center sm:justify-between">

                    <Footer.LinkGroup>
                        <Footer.Link href="/">Home</Footer.Link>
                        <Footer.Link href="/about">About</Footer.Link>
                        <Footer.Link href="/contact">Contact</Footer.Link>
                    </Footer.LinkGroup>
                    <div className='flex'>
                        <div style={logoStyleSphn} className="w-20 h-10 my-auto ml-6 m-2 bg-no-repeat bg-contain bg-center"></div>
                        <div style={logoStyleUsz} className="w-20 h-10 my-auto ml-6 m-2 bg-no-repeat bg-contain bg-center"></div>
                        <div style={logoStyleChuv} className="w-20 h-10 my-auto ml-6 m-2 bg-no-repeat bg-contain bg-center"></div>
                    </div>
                </div>
                {/* <Footer.Divider /> */}
                {/* <Footer.Copyright href="#" by="Flowbite™" year={2022} /> */}
            </div>
        </Footer>
    );
}
