"use client";

import { useRouter } from 'next/router';
import { createConfig, getConfigs } from "../../../utils/config"
import { useEffect, useState } from 'react';
import { TemplatebackendConfig } from '~/internal/client';
import { useAuth } from '~/utils/authContext';

const TransformPage = () => {
    const router = useRouter();
    const { id } = router.query; // Get the dynamic part of the URL
    const datasetId = Number(id);
    const { isLoggedIn } = useAuth();
    const [configs, setConfigs] = useState<TemplatebackendConfig[]>([]);
    const [openConfigId, setOpenConfigId] = useState<number | null>(null);
    const [openDetailId, setOpenDetailId] = useState<string | null>(null);
    const [config, setConfig] = useState<TemplatebackendConfig>({});
    const [showModal, setShowModal] = useState(false);

    const toggleConfig = (id: number | undefined) => {
        if (id) {
            setOpenConfigId(openConfigId === id ? null : id);
        }
    };
    const toggleDetail = (detailId: string) => {
        setOpenDetailId(openDetailId === detailId ? null : detailId);
    };

    const handleGetConfigs = async () => {
        const response = await getConfigs();
        if (response && response.result?.config && response.result?.config.length > 0) {
            console.log(response.result?.config)
            setConfigs(response.result?.config)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement; // Assumption made for simplicity, adjust if needed

        if (target.type === 'checkbox') {
            setConfig(prev => ({ ...prev, [target.name]: target.checked }));
        } else if (target.type === 'text' && ['scrambleFieldFields', 'subFieldListFields', 'subFieldListSubstitute', 'subFieldRegexFields'].includes(target.name)) {
            // Assuming comma-separated input for arrays
            setConfig(prev => ({ ...prev, [target.name]: target.value.split(',').map(item => item.trim()) }));
        } else {
            setConfig(prev => ({ ...prev, [target.name]: target.value }));
        }
    };

    const handleCreateConfig = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await createConfig(config);
        if (response?.result?.id) {
            handleGetConfigs();
        }
        setShowModal(false);
    }

    useEffect(() => {
        if (id) {
            try {
                handleGetConfigs();
            } catch (error) {
                alert("Error getting the data");
            }
        }
    }, [id]);



    return (
        <>
            {!isLoggedIn &&
                <p className='m-8'> Please log in to consult your datasets.</p>
            }
            {isLoggedIn &&
                <div>
                    <h1 className='mt-5 text-center text-xl font-bold'>Configurations</h1>
                    <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Create Config
                    </button>
                    <div>
                        {configs.map((config) => (
                            <div key={config.id} className="mb-4 border border-gray-300 p-4">
                                <button
                                    onClick={() => toggleConfig(config.id)}
                                    className="w-full text-left bg-gray-100 p-2 font-semibold text-lg focus:outline-none"
                                >
                                    Configuration {config.id}
                                    {/* <span className={`ml-2 transform ${openConfigId === config.id ? 'rotate-180' : 'rotate-0'} transition-transform`}> */}
                                    <span className={`ml-2 inline-block transform transition-transform duration-200 ${openConfigId === config.id ? 'rotate-180' : 'rotate-0'}`}>
                                        ▼
                                    </span>
                                </button>
                                {openConfigId === config.id && (
                                    <div className="mt-2 bg-white p-2">
                                        {config.hasScrambleField && (
                                            <>
                                                <button onClick={() => toggleDetail(`scramble-${config.id}`)}
                                                    className="w-full text-left bg-blue-100 p-2 font-semibold text-lg focus:outline-none">
                                                    Scramble Field
                                                    <span className={`ml-2  inline-block transform transition-transform duration-200 ${openDetailId === `scramble-${config.id}` ? 'rotate-180' : 'rotate-0'}`}>
                                                        ▼
                                                    </span>
                                                </button>
                                                {openDetailId === `scramble-${config.id}` && (
                                                    <div className="p-2">
                                                        <h4 className="font-bold">Scramble Field Parameters:</h4>
                                                        <p>Fields: {config.scrambleFieldFields?.join(', ')}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {config.hasDateShift && (
                                            <>
                                                <button onClick={() => toggleDetail(`dateShift-${config.id}`)}
                                                    className="w-full text-left bg-blue-100 p-2 font-semibold text-lg focus:outline-none">
                                                    Date Shift
                                                    <span className={`ml-2  inline-block transform transition-transform duration-200 ${openDetailId === `dateShift-${config.id}` ? 'rotate-180' : 'rotate-0'}`}>
                                                        ▼
                                                    </span>
                                                </button>
                                                {openDetailId === `dateShift-${config.id}` && (
                                                    <div className="p-2">
                                                        <h4 className="font-bold">Date Shift Parameters:</h4>
                                                        <p>Low Range: {config.dateShiftLowrange}</p>
                                                        <p>High Range: {config.dateShiftHighrange}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {config.hassubFieldList && (
                                            <>
                                                <button onClick={() => toggleDetail(`subfieldlist-${config.id}`)}
                                                    className="w-full text-left bg-blue-100 p-2 font-semibold text-lg focus:outline-none">
                                                    SubField List Replacement
                                                    <span className={`ml-2  inline-block transform transition-transform duration-200 ${openDetailId === `subfieldlist-${config.id}` ? 'rotate-180' : 'rotate-0'}`}>
                                                        ▼
                                                    </span>
                                                </button>
                                                {openDetailId === `subfieldlist-${config.id}` && (
                                                    <div className="p-2">
                                                        <h4 className="font-bold">Subfield List Replacement Parameters:</h4>
                                                        <p>Fields: {config.subFieldListFields}</p>
                                                        <p>Substitute: {config.subFieldListSubstitute}</p>
                                                        <p>Replacement: {config.subFieldListReplacement}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {config.hassubFieldRegex && (
                                            <>
                                                <button onClick={() => toggleDetail(`subfieldregex-${config.id}`)}
                                                    className="w-full text-left bg-blue-100 p-2 font-semibold text-lg focus:outline-none">
                                                    SubField Regex Replacement
                                                    <span className={`ml-2  inline-block transform transition-transform duration-200 ${openDetailId === `subfieldregex-${config.id}` ? 'rotate-180' : 'rotate-0'}`}>
                                                        ▼
                                                    </span>
                                                </button>
                                                {openDetailId === `subfieldregex-${config.id}` && (
                                                    <div className="p-2">
                                                        <h4 className="font-bold">Subfield Regex Replacement Parameters:</h4>
                                                        <p>Fields: {config.subFieldRegexFields}</p>
                                                        <p>Regex: {config.subFieldRegexRegex}</p>
                                                        <p>Replacement: {config.subFieldRegexReplacement}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {showModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <div className="mt-3 text-center">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">New Configuration</h3>
                                    <div className="mt-2 px-7 py-3">
                                        <form onSubmit={handleCreateConfig} className="space-y-4">
                                            {/* Form fields go here */}
                                            <input type="text" name="userid" onChange={handleChange} placeholder="User ID" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                            {/* Add other fields similarly */}
                                            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                                Submit
                                            </button>
                                        </form>
                                    </div>
                                    <div className="items-center px-4 py-3">
                                        <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleCreateConfig} className="space-y-4 p-4">
                        <div>
                            <label htmlFor="userid" className="block text-sm font-medium text-gray-700">User ID</label>
                            <input type="number" name="userid" id="userid" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="hasScrambleField" className="block text-sm font-medium text-gray-700">Has Scramble Field</label>
                            <input type="checkbox" name="hasScrambleField" id="hasScrambleField" onChange={handleChange} className="mt-1 block" />
                        </div>
                        <div>
                            <label htmlFor="scrambleFieldFields" className="block text-sm font-medium text-gray-700">Scramble Field Fields (comma-separated)</label>
                            <textarea name="scrambleFieldFields" id="scrambleFieldFields" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                        </div>
                        {/* Add additional form fields for each property in TemplateBackendConfig */}
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Submit Configuration
                        </button>
                    </form>
                </div>}
        </>
    );
};

export default TransformPage;
