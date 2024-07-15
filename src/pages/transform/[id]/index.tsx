"use client";

import { useRouter } from 'next/router';
import { createConfig, getConfigs } from "../../../utils/config"
import { useEffect, useState } from 'react';
import { TemplatebackendConfig } from '~/internal/client';
import { useAuth } from '~/utils/authContext';
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import { Button, Modal } from 'flowbite-react';

const TransformPage = () => {
    const router = useRouter();
    const { id } = router.query; // Get the dynamic part of the URL
    const datasetId = Number(id);
    const { isLoggedIn } = useAuth();
    const [configs, setConfigs] = useState<TemplatebackendConfig[]>([]);
    const [openConfigId, setOpenConfigId] = useState<number | null>(null);
    const [openDetailId, setOpenDetailId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [hasScrambleField, setHasScrambleField] = useState(false);
    const defaultScrambleFields = `
        sphn:SubjectPseudoIdentifier/sphn:hasIdentifier,
        sphn:AdministrativeCase/sphn:hasIdentifier,
        sphn:Sample/sphn:hasIdentifier,
        sphn:hasSample/sphn:hasIdentifier,
        sphn:HealthcareEncounter/sphn:hasIdentifier,
        sphn:Isolate/sphn:hasIdentifier,
        sphn:Code/sphn:hasIdentifier,
        sphn:TumorSpecimen/sphn:hasIdentifier,
        sphn:Assay/sphn:hasIdentifier,
        sphn:Biobanksample/sphn:hasIdentifier,
        sphn:SequencingRun/sphn:hasIdentifier,
        sphn:SequencingAssay/sphn:hasIdentifier
    `.trim();

    const [config, setConfig] = useState<TemplatebackendConfig>({
        scrambleFieldFields: defaultScrambleFields.split(',').map(item => item.trim())
    });

    const [hasDateShift, setHasDateShift] = useState(false);
    const [dateShiftRange, setDateShiftRange] = useState({
        low: -30,
        high: 30
    });
    const [hassubFieldList, setHassubFieldList] = useState(false);
    const [hassubFieldRegex, setHassubFieldRegex] = useState(false);


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
            if (target.name === 'hasScrambleField') {
                setHasScrambleField(target.checked);
            }
            else if (target.name === 'hasDateShift') {
                setHasDateShift(target.checked);
            }
            else if (target.name === 'hasSubFieldList') {
                setHassubFieldList(target.checked);
            }
            else if (target.name === 'hasSubFieldRegex') {
                setHassubFieldRegex(target.checked);
            }
            setConfig(prev => ({ ...prev, [target.name]: target.checked }));
        } else if (target.name === 'scrambleFieldFields') {
            setConfig(prev => ({ ...prev, [target.name]: target.value.split(',').map(item => item.trim()) }));
        } else {
            console.log("CONFIG other:", target.name)
            setConfig(prev => ({ ...prev, [target.name]: target.value }));
        }
    };

    const handleCreateConfig = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await createConfig(config);
        if (response?.result?.id) {
            handleGetConfigs();
        }
        closeCreateConfigModal();
    }

    const closeCreateConfigModal = () => {
        setShowModal(false);
        setHasDateShift(false);
        setHasScrambleField(false);
        setHassubFieldList(false);
        setHassubFieldRegex(false);
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
                <>
                    <h1 className='my-5 text-center text-xl font-bold'>Configurations</h1>

                    <div className="flex flex-col items-end p-5">
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                            <MdOutlineAdd size={30} />
                            <p className='ml-2 text-md'> Create config </p>
                        </button>
                        <div className="mt-5 overflow-x-auto w-full rounded">
                            <div>
                                {configs.map((config) => (
                                    <div key={config.id} className="mb-4 border border-gray-300 p-4">
                                        <button
                                            onClick={() => toggleConfig(config.id)}
                                            className="w-full text-left bg-gray-100 p-2 font-semibold text-md focus:outline-none"
                                        >
                                            Configuration {config.id}
                                            {/* <span className={`ml-2 transform ${openConfigId === config.id ? 'rotate-180' : 'rotate-0'} transition-transform`}> */}
                                            <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openConfigId === config.id ? 'rotate-180' : 'rotate-0'}`}>
                                                ▼
                                            </span>
                                        </button>
                                        {openConfigId === config.id && (
                                            <div className="mt-2 bg-white p-2">
                                                {config.hasScrambleField && (
                                                    <>
                                                        <button onClick={() => toggleDetail(`scramble-${config.id}`)}
                                                            className="w-full text-left bg-blue-100 p-2 font-semibold text-md focus:outline-none">
                                                            Scramble Field
                                                            <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openDetailId === `scramble-${config.id}` ? 'rotate-180' : 'rotate-0'}`}>
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
                                                            className="w-full text-left bg-blue-100 p-2 font-semibold text-md focus:outline-none">
                                                            Date Shift
                                                            <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openDetailId === `dateShift-${config.id}` ? 'rotate-180' : 'rotate-0'}`}>
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
                                                            className="w-full text-left bg-blue-100 p-2 font-semibold text-md focus:outline-none">
                                                            SubField List Replacement
                                                            <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openDetailId === `subfieldlist-${config.id}` ? 'rotate-180' : 'rotate-0'}`}>
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
                                                            className="w-full text-left bg-blue-100 p-2 font-semibold text-md focus:outline-none">
                                                            SubField Regex Replacement
                                                            <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openDetailId === `subfieldregex-${config.id}` ? 'rotate-180' : 'rotate-0'}`}>
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
                        </div>

                        <Modal show={showModal} onClose={() => closeCreateConfigModal()}>
                            <Modal.Body>
                                <div className="space-y-6">
                                    <h2 className="text-lg font-bold mb-2">New Configuration</h2>
                                    <form onSubmit={handleCreateConfig} className="space-y-4">
                                        {/* <input type="text" name="userid" onChange={handleChange} placeholder="User ID" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" /> */}
                                        {/* Date Shift */}
                                        <div>
                                            <label htmlFor="hasDateShift" className="block text-sm font-medium text-gray-700">Has Date Shift</label>
                                            <input type="checkbox" name="hasDateShift" id="hasDateShift" onChange={handleChange} className="mt-1 block" />
                                        </div>
                                        {hasDateShift && <div>
                                            <label htmlFor="dateshiftlowrange" className="block text-sm font-medium text-gray-700">Date shift lower range</label>
                                            <input
                                                type="number"
                                                name="dateshiftlowrange"
                                                id="dateshiftlowrange"
                                                value={dateShiftRange.low}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                min="-30"
                                                max={dateShiftRange.high - 1}  // Ensure this is always less than the high range
                                                step="1"
                                                placeholder="Enter minimum shift"
                                            />                                            <label htmlFor="dateshifthighrange" className="block text-sm font-medium text-gray-700">Date shift higher range</label>
                                            <input
                                                type="number"
                                                name="dateshifthighrange"
                                                id="dateshifthighrange"
                                                value={dateShiftRange.high}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                min={dateShiftRange.low + 1}  // Ensure this is always greater than the low range
                                                step="1"
                                                placeholder="Enter maximum shift"
                                            />
                                        </div>
                                        }
                                        {/* Scramble Fields */}
                                        <div>
                                            <label htmlFor="hasScrambleField" className="block text-sm font-medium text-gray-700">Has Scramble Field</label>
                                            <input type="checkbox" name="hasScrambleField" id="hasScrambleField" onChange={handleChange} className="mt-1 block" />
                                        </div>
                                        {hasScrambleField && <div>
                                            <label htmlFor="scrambleFieldFields" className="block text-sm font-medium text-gray-700">Scramble Fields (comma-separated)</label>
                                            <textarea name="scrambleFieldFields" id="scrambleFieldFields" value={config.scrambleFieldFields?.join(", ")} onChange={handleChange} className="mt-1 block w-full  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            </textarea>
                                        </div>
                                        }
                                        {/* SubField List */}
                                        <div>
                                            <label htmlFor="hasSubFieldList" className="block text-sm font-medium text-gray-700">Has Substitute Field List</label>
                                            <input type="checkbox" name="hasSubFieldList" id="hasSubFieldList" onChange={handleChange} className="mt-1 block" />
                                        </div>
                                        {hassubFieldList && <div>
                                            <label htmlFor="subFieldListField" className="block text-sm font-medium text-gray-700">Substitute Field</label>
                                            <textarea name="subFieldListField" id="subFieldListField" placeholder='sphn:Allergy/id' onChange={handleChange} className="mt-1 block w-1/2  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                                            <label htmlFor="subFieldListValues" className="block text-sm font-medium text-gray-700">Values to be substituted (comma-separated)</label>
                                            <textarea name="subFieldListValues" id="subFieldListValues" placeholder='allergy1, allergy2, allergy3' onChange={handleChange} className="mt-1 block w-full  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                                            <label htmlFor="subFieldListReplacement" className="block text-sm font-medium text-gray-700">Replacement string</label>
                                            <textarea name="subFieldListReplacement" id="subFieldListReplacement" placeholder='ALLERGY_ID' onChange={handleChange} className="mt-1 block w-1/2  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                                        </div>
                                        }
                                        {/* SubField Regex */}
                                        <div>
                                            <label htmlFor="hasSubFieldRegex" className="block text-sm font-medium text-gray-700">Has Substitute Field Regex</label>
                                            <input type="checkbox" name="hasSubFieldRegex" id="hasSubFieldRegex" onChange={handleChange} className="mt-1 block" />
                                        </div>
                                        {hassubFieldRegex && <div>
                                            <label htmlFor="subFieldRegexField" className="block text-sm font-medium text-gray-700">Substitute Field</label>
                                            <textarea name="subFieldRegexField" id="subFieldRegexField" placeholder="sphn:Allergy/id" onChange={handleChange} className="mt-1 block w-1/2  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                                            <label htmlFor="subFieldRegex" className="block text-sm font-medium text-gray-700">Regex expression to be substituted</label>
                                            <textarea name="subFieldRegex" id="subFieldRegex" placeholder='^allergy[1-3]$' onChange={handleChange} className="mt-1 block w-1/2  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                                            <label htmlFor="subFieldRegexReplacement" className="block text-sm font-medium text-gray-700">Replacement string</label>
                                            <textarea name="subFieldRegexReplacement" id="subFieldRegexReplacement" placeholder='ALLERGY_ID' onChange={handleChange} className="mt-1 block w-1/2  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                                        </div>
                                        }
                                        <button type="submit" className="mt-4 bg-gray-400 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                                            Submit
                                        </button>
                                    </form>

                                </div>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={() => {
                                    closeCreateConfigModal();
                                    router.push('dataset');
                                }}>
                                    Cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>


                        {/* <form onSubmit={handleCreateConfig} className="space-y-4 p-4">
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
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Submit Configuration
                        </button>
                    </form> */}
                    </div>
                </>}
        </>
    );
};

export default TransformPage;
