import { Footer } from 'flowbite-react';

export default function FooterMenu() {
    return (
        <Footer container className="fixed bottom-0 left-0 right-0 z-20">
            <div className="w-full text-center">
                <div className="w-full justify-between  sm:flex sm:items-center sm:justify-between">
                    <Footer.Brand
                        href="https://sphn.ch"
                        src="sphn-logo.png"
                        name="SPHN"
                        className='h-15'
                    />
                    <Footer.Brand
                        href="https://sphn.ch"
                        src="usz-logo.png"
                        name="USZ"
                    />
                    <Footer.Brand
                        href="https://sphn.ch"
                        src="chuv-logo.png"
                        name="CHUV"
                    />
                    <Footer.LinkGroup>
                        <Footer.Link href="/about">About</Footer.Link>
                        <Footer.Link href="#">Privacy Policy</Footer.Link>
                        <Footer.Link href="#">Licensing</Footer.Link>
                        <Footer.Link href="/contact">Contact</Footer.Link>
                    </Footer.LinkGroup>
                </div>
                {/* <Footer.Divider /> */}
                {/* <Footer.Copyright href="#" by="Flowbite™" year={2022} /> */}
            </div>
        </Footer>
    );
}
