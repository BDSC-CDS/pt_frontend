import Link from "next/link";
import { useEffect, useState } from "react";
import { Sidebar } from 'flowbite-react';
import { BiBuoy } from 'react-icons/bi';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards, HiPresentationChartBar } from 'react-icons/hi';
import Image from 'next/image';

export default function SideMenu() {

    return (

        <div className="fixed top-0 left-0 h-full z-10">
            <Sidebar aria-label="Sidebar with content separator example" className="w-70">
                <div>
                    <Sidebar.Logo href="/" img="sphn-logo.png" className="mb-17">
                        {/* <Image src="sphn-logo.png" alt="Logo" width={180} height={180} layout="fixed" /> */}
                        <span className="my-5">RDeID Platform </span>
                    </Sidebar.Logo>
                </div>
                <div>
                    <Sidebar.Items>
                        <Sidebar.ItemGroup />
                        <Sidebar.ItemGroup>
                            <Sidebar.Item href="/risk_assess" icon={HiPresentationChartBar}>
                                Risk Assessment
                            </Sidebar.Item>
                            <Sidebar.Item href="#" icon={HiUser}>
                                About us
                            </Sidebar.Item>

                            <Sidebar.Item href="#" icon={HiUser}>
                                Datasets
                            </Sidebar.Item>
                            <Sidebar.Item href="#" icon={HiShoppingBag}>
                                Synthetic Data Generation
                            </Sidebar.Item>
                            <Sidebar.Item href="#" icon={HiArrowSmRight}>
                                Text DeID
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>
                        <Sidebar.ItemGroup className="mt-20">
                            <Sidebar.Item href="#" icon={HiInbox}>
                                Documentation
                            </Sidebar.Item>
                            <Sidebar.Item href="#" icon={BiBuoy}>
                                Settings
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>

                        <Sidebar.ItemGroup className=" absolute bottom-1.5 ">
                            <Sidebar.Item href="/authenticate" icon={HiUser}>
                                User
                            </Sidebar.Item>

                        </Sidebar.ItemGroup>

                    </Sidebar.Items>
                </div>
            </Sidebar >
        </div >
    )
};
