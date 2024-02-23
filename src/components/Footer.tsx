import { Footer } from 'flowbite-react';
import chuv_svg from '../../public/chuv_svg.svg'

export default function FooterMenu() {
    return (
        <div className="w-full mt-10">
            <Footer container>
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
                            <Footer.Link href="#">About</Footer.Link>
                            <Footer.Link href="#">Privacy Policy</Footer.Link>
                            <Footer.Link href="#">Licensing</Footer.Link>
                            <Footer.Link href="#">Contact</Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    {/* <Footer.Divider /> */}
                    {/* <Footer.Copyright href="#" by="Flowbite™" year={2022} /> */}
                </div>
            </Footer>
        </div>
    );
}
