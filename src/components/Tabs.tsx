import { useState } from 'react';
// import GaugeChart from 'react-gauge-chart'

const TabsComponent = () => {
    const [activeTab, setActiveTab] = useState<string>('1');

    const question =
        <form className="w-1/2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
            <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option selected>Choose a country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
            </select>
        </form>

    const tooltip =
        <div className="relative">
            <div className="group cursor-pointer ml-2 mt-6">
                <span className="w-6 h-6 flex items-center justify-center bg-gray-400 text-white rounded-full text-sm font-bold">?</span>
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="relative z-10 p-2 w-40 text-xs leading-none text-white whitespace-no-wrap bg-gray-700 shadow-lg rounded-md">This is a tooltip.</span>
                    <div className="w-3 h-3 -mt-2 -ml-20 rotate-45 bg-gray-700 "></div>
                </div>
            </div>
        </div>

    const contentArray = Array.from({ length: 9 }, (_, index) => `Item ${index + 1}`);

    const tabContent = contentArray.map((_, index) => (
        <div key={index} className='mt-7'>
            <div className='flex items-center'>
                {question}
                {tooltip}
            </div>
        </div>
    ));

    const tabs = [
        {
            id: '1',
            title: 'Basic Info',
            content: tabContent,
        },
        {
            id: '2',
            title: 'Structured Data',
            content: tabContent,
        },
        {
            id: '3',
            title: 'Multimedia',
            content: tabContent,
        },
        {
            id: '4',
            title: 'Dataset',
            content: tabContent,
        },
        {
            id: '5',
            title: 'IT',
            content: tabContent,
        },
        {
            id: '6',
            title: 'Contextual',
            content: tabContent,
        },
        {
            id: '7',
            title: 'Administrative',
            content: tabContent,
        },
        {
            id: '8',
            title: 'Results',
            content: tabContent,
        },
    ];

    return (
        <>
            <ul className="flex items-stretch w-full">
                {tabs.map((tab) => (
                    <li
                        key={tab.id}
                        //lg:px-11
                        className={`flex-grow text-center  py-2 px-0  cursor-pointer text-md text-gray-600 ${activeTab === tab.id && 'border-b-2 border-gray-600 bg-gray-100'}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <div className='flex items-center pl-2'>
                            <span className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full shrink-0 ">
                                {tab.id}
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight pl-2">{tab.title}</h3>
                            </span>
                        </div>
                        {/* {tab.title} */}
                    </li>
                ))}
            </ul>
            <hr className="h-px bg-gray-500 border-0 " />

            <div className="p-10">
                {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>
            <div className='fixed bottom-0 right-0 h-3/4 w-1/6 bg-white  '>

            </div>
        </>

    );
};

export default TabsComponent;
