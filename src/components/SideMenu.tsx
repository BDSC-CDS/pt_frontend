import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { BiBuoy } from 'react-icons/bi';
import { HiArrowSmRight, HiDatabase, HiInbox, HiShoppingBag, HiQuestionMarkCircle, HiUser, HiViewBoards, HiPresentationChartBar } from 'react-icons/hi';


export default function SideMenu() {

    return (

        <div className="fixed top-20 left-0 h-3/4 z-10 ">
            <Sidebar aria-label="Sidebar with content separator example" className="w-90 border rounded">
                <div>
                    <Sidebar.Items>
                        <Sidebar.ItemGroup >
                            <Sidebar.Item href="/" passHref className="text-semibold">
                                <p className="font-bold text-lg"> Privacy Toolbox</p>
                            </Sidebar.Item>
                        </Sidebar.ItemGroup >
                        <Sidebar.ItemGroup>
                            <Link href="/risk_assessment" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                {/* <Sidebar.Item icon={HiPresentationChartBar}> */}
                                <HiPresentationChartBar size={'2em'} color='gray' />
                                <p className='ml-1'> Risk Assessment</p>
                                {/* </Sidebar.Item> */}
                            </Link>
                            {/* <Sidebar.Item href="/about" passHref icon={HiQuestionMarkCircle}>
                                About us
                            </Sidebar.Item> */}

                            <Link href="/dataset_service" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <HiDatabase size={'2em'} color='gray' />
                                <p className='ml-1'> Datasets</p>
                            </Link>
                            <Sidebar.Item href="#" passHref icon={HiShoppingBag}>
                                Synthetic Data Generation
                            </Sidebar.Item>
                            <Sidebar.Item href="#" passHref icon={HiArrowSmRight}>
                                Text DeID
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>
                        <Sidebar.ItemGroup className="mt-10">
                            <Sidebar.Item href="#" passHref icon={HiInbox}>
                                Documentation
                            </Sidebar.Item>
                            <Sidebar.Item href="#" passHref icon={BiBuoy}>
                                Settings
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>

                    </Sidebar.Items>
                </div>
            </Sidebar >
        </div >
    )
};
