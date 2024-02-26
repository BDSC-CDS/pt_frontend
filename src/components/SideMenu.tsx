import Link from "next/link";
import { useEffect, useState } from "react";
import { Sidebar } from 'flowbite-react';
import { BiBuoy } from 'react-icons/bi';
import { HiArrowSmRight, HiDatabase, HiInbox, HiShoppingBag, HiQuestionMarkCircle, HiUser, HiViewBoards, HiPresentationChartBar } from 'react-icons/hi';
import Image from 'next/image';

export default function SideMenu() {

    return (

        <div className="fixed top-0 left-0 h-full z-10">
            <Sidebar aria-label="Sidebar with content separator example" className="w-70">
                <div>
                    <Sidebar.Items>
                        <Sidebar.ItemGroup />
                        <br />
                        <Sidebar.ItemGroup>
                            <Sidebar.Item href="/risk_assessment" passHref icon={HiPresentationChartBar}>
                                Risk Assessment
                            </Sidebar.Item>
                            <Sidebar.Item href="/about" passHref icon={HiQuestionMarkCircle}>
                                About us
                            </Sidebar.Item>

                            <Sidebar.Item href="#" passHref icon={HiDatabase}>
                                Datasets
                            </Sidebar.Item>
                            {/* <Sidebar.Item href="#" passHref icon={HiShoppingBag}>
                                Synthetic Data Generation
                            </Sidebar.Item>
                            <Sidebar.Item href="#" passHref icon={HiArrowSmRight}>
                                Text DeID
                            </Sidebar.Item> */}
                        </Sidebar.ItemGroup>
                        <Sidebar.ItemGroup className="mt-20">
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
