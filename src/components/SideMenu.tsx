import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { BiBuoy, BiCalculator, BiMessageSquareDetail, BiSolidReport, BiSolidRuler } from 'react-icons/bi';
import { HiDatabase, HiInbox, HiShoppingBag, HiPresentationChartBar, HiOutlineCog, HiLockClosed, HiCog } from 'react-icons/hi';
import { HiClipboardDocumentList } from 'react-icons/hi2';
import { useAuth } from '~/utils/authContext';
import type { CustomFlowbiteTheme } from "flowbite-react";

export default function SideMenu() {
    const { isAdmin } = useAuth();

    const customTheme: CustomFlowbiteTheme["sidebar"] = {
        collapse: {
            "icon": {
                "base": "h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
            },
        },
    };


    return (
        <div className="w-72 top-14 sticky h-full bg-white">

            <Sidebar aria-label="Sidebar" className="w-90 border pt-10 rounded">
                <div>
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            <Sidebar.Collapse icon={HiPresentationChartBar} theme={customTheme.collapse} label="Risk Assessment">
                                <Link href="/risk_assessment" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                    <BiMessageSquareDetail />
                                    <p className='ml-1'>Qualitative Risk Assessment</p>
                                </Link>
                                <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                    <BiCalculator />
                                    <p className='ml-1'>Formal Risk Assessment</p>
                                </Link>
                            </Sidebar.Collapse>
                        </Sidebar.ItemGroup>

                        <Sidebar.ItemGroup>
                            <Sidebar.Collapse icon={HiCog} theme={customTheme.collapse} label="De-identification">
                                <Link href="/risk_assessment" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                    <BiSolidRuler />
                                    <p className='ml-1'>Rule-based De-identification</p>
                                </Link>
                                <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                    <BiSolidReport />
                                    <p className='ml-1'>Formal De-identification</p>
                                </Link>
                            </Sidebar.Collapse>
                        </Sidebar.ItemGroup>

                        <Sidebar.ItemGroup>
                            <Link href="/dataset" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <HiDatabase />
                                <p className='ml-1'>Datasets</p>
                            </Link>
                            <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <HiShoppingBag />
                                <p className='ml-1'>Tabular DeID</p>
                            </Link>
                            <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <HiShoppingBag />
                                <p className='ml-1'>Synthetic Data Generation</p>
                            </Link>
                            <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <HiShoppingBag />
                                <p className='ml-1'>Text DeID</p>
                            </Link>
                        </Sidebar.ItemGroup>
                        <Sidebar.ItemGroup className="mt-10">
                            <Sidebar.Collapse className={`${!isAdmin ? "hidden" : ""}`} icon={HiOutlineCog} theme={customTheme.collapse} label="Admin">
                                <Link href="/admin/questionnaire" passHref className='flex items-center ml-10 hover:bg-gray-100 hover:rounded'>
                                    <HiClipboardDocumentList />
                                    <p className='ml-1'>Questionnaires</p>
                                </Link>
                                <Link href="/audit-logging" passHref className='flex items-center ml-10 hover:bg-gray-100 hover:rounded'>
                                    <HiLockClosed />
                                    <p className='ml-1'>Audit Log</p>
                                </Link>
                            </Sidebar.Collapse>
                            <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <HiInbox />
                                <p className='ml-1'>Documentation</p>
                            </Link>
                            <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <BiBuoy />
                                <p className='ml-1'>Settings</p>
                            </Link>
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </div>
            </Sidebar>
        </div>
    )
};
