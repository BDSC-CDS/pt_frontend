"use client";

import { useRouter } from 'next/router';
import { createConfig, getConfigs, deleteConfig, exportConfig } from "../../../utils/config"
import { useEffect, useMemo, useRef, useState } from 'react';
import { TemplatebackendConfig, TemplatebackendMetadata } from '~/internal/client';
import { useAuth } from '~/utils/authContext';
import { MdOutlineAdd, MdMoreHoriz, MdFileUpload } from "react-icons/md";
import { Button, Modal, Alert, Tooltip } from 'flowbite-react';
import { transformDataset, getMetadata, getDatasetIdentifier, changeTypesDataset, getInfo } from "../../../utils/dataset";
import { saveAs } from 'file-saver';
import DataTable from '~/components/DataTable';
import withAuth from '~/components/withAuth';
import { showToast } from '~/utils/showToast';

const TransformPage = () => {

    // --------------------- variables --------------------------------- //
    const router = useRouter();
    const { id } = router.query; // Get the dynamic part of the URL
    const datasetId = Number(id);
    const { isLoggedIn } = useAuth();
    const [configs, setConfigs] = useState<TemplatebackendConfig[]>([]);
    const [filteredConfigs, setFilteredConfigs] = useState<TemplatebackendConfig[]>([]);

    const [openConfigId, setOpenConfigId] = useState<number | null>(null);
    const [openDetailId, setOpenDetailId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
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
        scrambleFieldFields: defaultScrambleFields.split(',').map(item => item.trim()),
        dateShiftLowrange: -30,
        dateShiftHighrange: 30,
    });
    const [hasDateShift, setHasDateShift] = useState(false);
    const [dateShiftRange, setDateShiftRange] = useState({
        low: -30,
        high: 30
    });
    const [hassubFieldList, setHassubFieldList] = useState(false);
    const [hassubFieldRegex, setHassubFieldRegex] = useState(false);
    const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null);
    const [metadata, setMetadata] = useState<Array<TemplatebackendMetadata>>();
    const [idMetadata, setIDMetadata] = useState<Array<TemplatebackendMetadata>>();
    const [filteredMetadata, setFilteredMetadata] = useState<Array<TemplatebackendMetadata>>();
    const [newMetadata, setNewMetadata] = useState<Array<TemplatebackendMetadata>>([]);
    const [selectedScrambleFields, setSelectedScrambleFields] = useState<Array<string>>([]);
    const [selectedSubListField, setSelectedSubListField] = useState("");
    const [selectedSubRegexField, setSelectedSubRegexField] = useState("");
    const [columns, setColumns] = useState<Array<Array<string | undefined> | undefined>>();
    const [nColumns, setNColumns] = useState(0);
    const [nRows, setNRows] = useState<number>(0);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showColTypeModal, setShowColTypeModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [idCol, setIdCol] = useState<string>();
    const [datasetName, setDatasetName] = useState<string>();
    const [createdAt, setCreatedAt] = useState<Date>();
    const [showImportModal, setShowImportModal] = useState(false);
    const [importedConfig, setImportedConfig] = useState<TemplatebackendConfig | null>(null);
    const [configName, setConfigName] = useState(""); // New state for config name
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const buttonClass = "flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer mr-2"

    // ----------------------------------- methods --------------------------------- //
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
            setConfigs(response.result.config)
        }
    }

    // Handle the export logic
    const handleExportConfig = async (configId: number | undefined) => {
        if (configId) {
            try {
                const response = await exportConfig(configId); // Call backend to get the config as a string
                if (response?.config) {
                    const blob = new Blob([response.config], { type: "application/json" });
                    saveAs(blob, `config_${configId}.json`); // Download the file with the configId as its name
                }
            } catch (error) {
                console.error("Error exporting the configuration", error);
            }
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement; // Assumption made for simplicity, adjust if needed
        if (target.type === 'checkbox') {
            if (target.name === 'hasScrambleField') {
                setHasScrambleField(target.checked);
            }
            else if (target.name === 'hasDateShift') {
                setHasDateShift(target.checked);
            }
            else if (target.name === 'hassubFieldList') {
                setHassubFieldList(target.checked);
            }
            else if (target.name === 'hassubFieldRegex') {
                setHassubFieldRegex(target.checked);
            }
            setConfig(prev => ({ ...prev, [target.name]: target.checked }));
        }

        // Handle date shift range updates
        else if (target.name === 'dateShiftLowrange' || target.name === 'dateShiftHighrange') {
            const newValue = parseInt(target.value, 10);
            // Update the dateShiftRange state
            setDateShiftRange(prev => ({
                ...prev,
                [target.name === 'dateShiftLowrange' ? 'low' : 'high']: newValue,
            }));
            // Update the config with the new values
            setConfig(prev => ({
                ...prev,
                dateShiftLowrange: target.name === 'dateShiftLowrange' ? newValue : prev.dateShiftLowrange,
                dateShiftHighrange: target.name === 'dateShiftHighrange' ? newValue : prev.dateShiftHighrange,
            }));
        }

        else if (target.name === 'subFieldListSubstitute') {
            setConfig(prev => ({ ...prev, ['subFieldListSubstitute']: target.value.split(',').map(item => item.trim()) }));

        } else {
            setConfig(prev => ({ ...prev, [target.name]: target.value }));
        }
    };

    const handleCreateConfig = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!config.configName) {
            setErrorMessage("Please provide a configuration name.");
            setShowErrorModal(true);
            return;
        }
        const response = await createConfig(config);
        if (response?.result?.id) {
            handleGetConfigs();
        }
        closeCreateConfigModal();
    }

    const closeCreateConfigModal = () => {
        setShowCreateModal(false);
        setHasDateShift(false);
        setHasScrambleField(false);
        setHassubFieldList(false);
        setHassubFieldRegex(false);
    }

    const handleCheckboxChange = (configId: number | undefined) => {
        if (configId) {
            setSelectedConfigId(prev => prev === configId ? null : configId);

        }
    };

    const applyTransformation = async (configId: number | null) => {
        if (!configId) return;
        try {
            const response = await transformDataset(datasetId, configId);
            // Implement the transformation logic for selected configurations
            if (response?.result) {
                router.push("/dataset/" + response.result.id);
            }
        } catch (error) {
            // Safely check if error is an instance of Error
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unexpected error occurred');
            }
            setShowErrorModal(true);
        }
    };

    const getDatasetInfo = async () => {
        const response = await getInfo(datasetId);
        if (response?.dataset) {
            setDatasetName(response.dataset.datasetName);
            setCreatedAt(response.dataset.createdAt);
        }
    }

    const getDatasetMetadata = async () => {
        const response = await getMetadata(datasetId);
        if (response?.metadata?.metadata) {
            setMetadata(response.metadata.metadata);
            setNewMetadata(JSON.parse(JSON.stringify(response.metadata.metadata)));
            const identifierMetadata = response.metadata.metadata.filter(item => (item.identifier === "identifier" || item.identifier === "quasi-identifier"));
            setIDMetadata(identifierMetadata);
            const filteredMetadata = response.metadata.metadata.filter(item => ((item.type === "int" || item.type === "float" || item.type === "string") && (item.identifier === "identifier" || item.identifier === "quasi-identifier")));
            setFilteredMetadata(filteredMetadata);
            if (filteredMetadata.length > 0 && filteredMetadata[0] && filteredMetadata[0].columnName) {
                setSelectedSubListField(filteredMetadata[0].columnName);
                // set default value for these two values in the configuration to the first column name
                setConfig(prev => ({
                    ...prev,
                    ['subFieldListField']: filteredMetadata[0]?.columnName
                }));
                setConfig(prev => ({
                    ...prev,
                    ['subFieldRegexField']: filteredMetadata[0]?.columnName
                }));
            }
            // set the original id column
            const originalIdCol = response.metadata.metadata.find((meta) => meta.isId)?.columnName;
            if (originalIdCol) {
                setIdCol(originalIdCol); // Reset idCol to original identifier column
            }

            //set the number of columns
            setNColumns(response.metadata.metadata.length);
        }
    }


    const handleMultiSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const options = event.target.options;
        const value: string[] = [];
        for (let i = 0, len = options.length; i < len; i++) {
            const option = options[i] as HTMLOptionElement;
            if (option && option.selected) {
                value.push(option.value);
            }
        }
        setSelectedScrambleFields(value);
        setConfig(prev => ({ ...prev, ['scrambleFieldFields']: value.map(item => item.trim()) }));
    };

    const getAndProcessDatasetContent = async () => {
        //const response = await getDatasetContent(datasetId, 0, 5);
        const response = await getDatasetIdentifier(datasetId, 0, 5);
        if (response && response.result?.columns) {
            const result = response.result?.columns.map((col) => {
                return col.value;
            })
            if (result) {
                setColumns(result)
                if (result[0]) {
                    setNRows(result[0].length)
                }
            }
        }
        if (response && response.result?.nRows) {
            setTotalRows(response.result.nRows);
        }
    }
    const handleMenuOpen = (id: number | undefined) => {
        if (id) {
            setOpenMenuId(id);
        }
    };

    const handleMenuClose = () => {
        setOpenMenuId(null);
    };

    const handleDeleteConfig = async (id: number | undefined) => {
        if (id) {
            const response = await deleteConfig(id);
            handleGetConfigs();
        }
    };

    const handleColumnTypeChange = async () => {
        setShowColTypeModal(true);
    };

    const setColumnType = (column: string | undefined, type: string) => {
        if (column && newMetadata) {
            // Update the newMetadata array
            const updatedMetadata = newMetadata.map(meta => {
                if (meta.columnName === column) {
                    return { ...meta, type: type };
                }
                return meta;
            });
            setNewMetadata(updatedMetadata); // Update the newMetadata state
        };
    };
    const setColumnIdentifying_ = (column: string | undefined, newIdentifier: string) => {
        if (column && newMetadata) {
            const updatedMetadata = newMetadata.map(meta => {
                if (meta.columnName === column) {
                    return { ...meta, identifier: newIdentifier };
                }
                return meta;
            });
            setNewMetadata(updatedMetadata); // Update the newMetadata state
        }
    };

    useEffect(() => {
        setConfig(prev => ({
            ...prev,
            scrambleFieldFields: selectedScrambleFields
        }));
    }, [selectedScrambleFields]);

    useEffect(() => {
        if (id) {
            try {
                getDatasetInfo();
                getDatasetMetadata();
                getAndProcessDatasetContent();
                // handleGetConfigs();
            } catch (error) {
                showToast("error", "Error retrieving dataset data.")
            }
        }
    }, [id]);

    // Fetch metadata and configs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [metadataResponse, configsResponse] = await Promise.all([
                    getMetadata(datasetId),
                    getConfigs()
                ]);

                if (configsResponse?.result?.config) {
                    setConfigs(configsResponse.result.config);
                }

            } catch (error) {
                setErrorMessage("Error fetching data");
            }
        };

        if (datasetId) {
            fetchData();
        }
    }, [datasetId]);

    // Filter the configurations based on the metadata
    useEffect(() => {
        if (metadata?.length && metadata.length > 0 && configs.length > 0) {
            const filtered = configs.filter(config => {
                // Check scrambleFieldFields (if present)
                const isValidScrambleFields = !config.hasScrambleField || (
                    config.scrambleFieldFields?.every(field => {
                        const column = metadata.find(meta => meta.columnName === field);
                        return column?.identifier === 'identifier' || column?.identifier === 'quasi-identifier';
                    })
                );

                // Check subFieldListField (if present)
                const isValidSubListField = !config.hassubFieldList || (
                    config.subFieldListField ? metadata.some(meta =>
                        meta.columnName === config.subFieldListField &&
                        (meta.identifier === 'identifier' || meta.identifier === 'quasi-identifier')
                    ) : true
                );

                // Check subFieldRegexField (if present)
                const isValidSubRegexField = !config.hassubFieldRegex || (
                    config.subFieldRegexField ? metadata.some(meta =>
                        meta.columnName === config.subFieldRegexField &&
                        (meta.identifier === 'identifier' || meta.identifier === 'quasi-identifier')
                    ) : true
                );

                // Only include configs that pass all these checks
                return isValidScrambleFields && isValidSubListField && isValidSubRegexField;
            });

            setFilteredConfigs(filtered);  // Set the filtered configurations
        }
    }, [configs, metadata]);



    const closeColumnTypeModal = () => {
        // Close the modal and reset newMetadata back to the original metadata
        setNewMetadata(JSON.parse(JSON.stringify(metadata))); // Reset to original values
        const originalIdCol = metadata?.find((meta) => meta.isId)?.columnName;
        if (originalIdCol) {
            setIdCol(originalIdCol); // Reset idCol to original identifier column
        }
        setShowColTypeModal(false);
    };

    const handleChangeTypes = async () => {
        // if the types have not changed from the original types
        if (!newMetadata || JSON.stringify(newMetadata) === JSON.stringify(metadata)) {
            closeColumnTypeModal();
            return;
        }
        try {

            const updatedMetadata = newMetadata.map(meta => ({
                ...meta,
                isId: meta.columnName === idCol // Ensure that isId is correct before sending
            }));

            const response = await changeTypesDataset(datasetId, updatedMetadata);
            // Implement the transformation logic for selected configurations
            if (response?.id) {
                router.push("/dataset/" + response.id);
                closeColumnTypeModal();
            }
        } catch (error) {
            // Safely check if error is an instance of Error
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unexpected error occurred');
            }
            setShowErrorModal(true);
        }
    }

    const nonIdentifyingColumns = useMemo(() => {
        return metadata?.filter((meta) => meta.identifier === 'non-identifying');
    }, [metadata]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const result = event.target?.result as string;
                const jsonConfig = JSON.parse(result);

                const newConfig: TemplatebackendConfig = {
                    configName: configName || "Imported Config",
                    hasScrambleField: !!jsonConfig.scrambleField,
                    hasDateShift: !!jsonConfig.dateShift,
                    hassubFieldList: !!jsonConfig.substituteFieldList,
                    hassubFieldRegex: !!jsonConfig.substituteFieldRegex,

                    // Scramble Field Mapping
                    scrambleFieldFields: jsonConfig.scrambleField?.defaultScrambling?.applies_to_fields || [],

                    // Date Shift Mapping
                    dateShiftLowrange: jsonConfig.dateShift?.defaultDateShift?.low_range || -30,
                    dateShiftHighrange: jsonConfig.dateShift?.defaultDateShift?.high_range || 30,

                    // Substitute Field List Mapping
                    subFieldListField: jsonConfig.substituteFieldList?.subIDlist?.applies_to_field || "",
                    subFieldListSubstitute: jsonConfig.substituteFieldList?.subIDlist?.substitution_list || [],
                    subFieldListReplacement: jsonConfig.substituteFieldList?.subIDlist?.replacement || "",

                    // Substitute Field Regex Mapping
                    subFieldRegexField: jsonConfig.substituteFieldRegex?.substituteFieldRegex?.applies_to_field || "",
                    subFieldRegexRegex: jsonConfig.substituteFieldRegex?.substituteFieldRegex?.regex || "",
                    subFieldRegexReplacement: jsonConfig.substituteFieldRegex?.substituteFieldRegex?.replacement || ""
                };

                // Store the imported config in state
                setImportedConfig(newConfig);
            } catch (error) {
                console.error('Error importing configuration:', error);
            }
        };
        reader.readAsText(file);
    };

    const handleImportSubmit = async () => {
        if (!importedConfig) return;
        try {
            const response = await createConfig(importedConfig);
            if (response?.result?.id) {
                console.log("Config imported successfully!");
                // You can refresh configs here
            }
            setShowImportModal(false); // Close modal after submit
            handleGetConfigs();
        } catch (error) {
            console.error('Error submitting configuration:', error);
        }
    };

    const handleOpenFileDialog = () => {
        fileInputRef.current?.click();
    };

    const closeImportModal = () => {
        setShowImportModal(false);
        setImportedConfig(null);
    };
    // ------------------------------- html -------------------------------------------- //

    return (
        <>
            {!isLoggedIn &&
                <p className='m-8'> Please log in to consult your datasets.</p>
            }
            {isLoggedIn &&
                <>
                    <div className="bg-gray-100 p-5 rounded-lg shadow text-md ">
                        <h2 className="text-lg font-bold mb-2"> {datasetName}</h2>
                        <p><strong>Created Date:</strong> {createdAt?.toLocaleString()} </p>
                        <p><strong>Number of Rows:</strong> {totalRows}</p>
                        <p><strong>Number of Columns:</strong> {nColumns} </p>
                    </div>

                    <div className="flex flex-col items-end pt-5 relative mb-1">


                        {/* Import Modal */}
                        <Modal show={showImportModal} onClose={() => setShowImportModal(false)}>
                            <Modal.Header>Import Configuration</Modal.Header>
                            <Modal.Body>
                                <div className="space-y-4">
                                    {/* Input field for config name */}
                                    <div>
                                        <label htmlFor="configName" className="block text-sm font-medium text-gray-700">
                                            Configuration Name
                                        </label>
                                        <input
                                            type="text"
                                            id="configName"
                                            value={configName}
                                            onChange={(e) => setConfigName(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            placeholder="Enter configuration name"
                                        />
                                    </div>

                                    {/* File input for uploading JSON */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Upload JSON</label>
                                        <input
                                            type="file"
                                            accept="application/json"
                                            onChange={handleFileUpload}
                                            className="mt-1 block w-full"
                                        />
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={handleImportSubmit} disabled={!importedConfig}>
                                    Submit
                                </Button>
                            </Modal.Footer>
                        </Modal>


                        {/* Modal for showing error messages */}
                        <Modal
                            show={showErrorModal}
                            onClose={() => setShowErrorModal(false)}
                        >
                            <Modal.Body>
                                <div className="text-center ">
                                    <div className="space-y-6">
                                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                            Error
                                        </p>
                                        <div>{errorMessage}</div>
                                    </div>
                                    <div className="flex justify-center gap-4 mt-4 ">

                                        <Button color="failure" onClick={() => setShowErrorModal(false)}>Close</Button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>

                        {/* Modal to change the column types */}
                        <Modal
                            show={showColTypeModal}
                            onClose={() => closeColumnTypeModal()}
                        >
                            <Modal.Header>
                                Change Column Types
                            </Modal.Header>
                            <Modal.Body>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between font-bold">
                                        <span className="w-1/2">Column Name</span>
                                        <div className="flex space-x-4 w-1/2">
                                            <span className="w-1/2">Type</span>
                                            <span className="w-1/2">Identifier</span>
                                            <span className="w-1/3">Is Identifier?</span>
                                        </div>
                                    </div>
                                    {newMetadata?.map(meta => (
                                        <>
                                            <div key={meta.columnId} className="flex items-center justify-between">
                                                <span className="w-1/2">{meta.columnName}:</span>
                                                <div className="flex space-x-4 w-1/2">
                                                    <select
                                                        value={meta.type}
                                                        onChange={(e) => setColumnType(meta.columnName, e.target.value)}
                                                        className="select select-bordered w-1/2"
                                                    >
                                                        <option value="string">String</option>
                                                        <option value="int">Integer</option>
                                                        <option value="float">Float</option>
                                                        <option value="date">Date</option>
                                                    </select>
                                                    <select
                                                        value={meta.identifier}
                                                        onChange={(e) => setColumnIdentifying_(meta.columnName, e.target.value)}
                                                        className="select select-bordered w-1/2"
                                                    >
                                                        <option value="identifier">Identifier</option>
                                                        <option value="quasi-identifier">Quasi-identifier</option>
                                                        <option value="non-identifying">Non-identifying</option>
                                                    </select>
                                                    <input
                                                        type="radio"
                                                        name="identifier-column"  // Radio group name should be the same for all
                                                        checked={idCol === meta.columnName}
                                                        onChange={() => setIdCol(meta.columnName)}
                                                        className="radio radio-bordered"
                                                    />
                                                </div>
                                            </div>
                                        </>))
                                    }
                                </div>
                            </Modal.Body>
                            <Modal.Footer className='flex justify-between'>
                                <Button className='bg-gray-400' onClick={() => closeColumnTypeModal()}>Close</Button>
                                <Button onClick={() => handleChangeTypes()}>Save</Button>
                            </Modal.Footer>
                        </Modal>

                        {/* Dataset preview*/}
                        <div className='flex flex-col w-full'>
                            <div className="flex items-center w-full mb-3">
                                {nonIdentifyingColumns && nonIdentifyingColumns?.length > 0 && (
                                    <Alert className="mt-2 ml-3 w-1/2" color="info">
                                        These are only the identifying and quasi-identifying columns. To change the column types, click <button onClick={handleColumnTypeChange} className='underline'>here</button>.
                                    </Alert>
                                )}
                                {/* Create Configuration Button */}
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className={buttonClass}
                                >
                                    <MdOutlineAdd size={20} className="mr-2" />
                                    Create Configuration
                                </button>

                                {/* Import Configuration Button */}
                                <button
                                    onClick={() => setShowImportModal(true)}
                                    className={buttonClass}
                                >
                                    <MdFileUpload size={20} className="mr-2" />
                                    <p className='ml-2 text-md'> Import Configuration </p>
                                </button>
                            </div>

                            {/* Configurations */}
                            {filteredConfigs.length > 0 ? (
                                <div className="overflow-auto w-1/3 rounded-lg border border-gray-300 pt-4">
                                    <div>
                                        <div className="mb-4 p-4 pb-4 py-1 flex items-start border-b">
                                            Select a configuration
                                        </div>
                                        {filteredConfigs?.map((config) => (
                                            <>
                                                <div key={config.id} className="mb-4 p-4 py-1 flex items-start">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedConfigId === config.id}
                                                        onChange={() => handleCheckboxChange(config.id)}
                                                        className="form-checkbox h-5 w-5 mr-4 mt-2"
                                                    />
                                                    <div className='w-full'>
                                                        <div className='flex ' onMouseLeave={handleMenuClose}>
                                                            <button
                                                                onClick={() => toggleConfig(config.id)}
                                                                className="w-full text-left  p-2 font-semibold text-md focus:outline-none"
                                                            >
                                                                {config.configName || `Configuration ${config.id}`}
                                                                <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openConfigId === config.id ? 'rotate-0' : 'rotate-180'}`}>
                                                                    ▼
                                                                </span>
                                                            </button>
                                                            <div className='flex justify-start items-center'>
                                                                <a
                                                                    onMouseEnter={() => handleMenuOpen(config.id)}

                                                                    className="text-gray-900 hover:text-blue-500">
                                                                    <MdMoreHoriz size={20} />
                                                                </a>
                                                                {openMenuId === config.id && (
                                                                    <div className="dropdown-menu">
                                                                        <ul className="absolute right-4 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                                                                            <li className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                onClick={() => handleDeleteConfig(config.id)}>
                                                                                Delete
                                                                            </li>
                                                                            <li
                                                                                className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                onClick={() => handleExportConfig(config.id)}
                                                                            >
                                                                                Export
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>


                                                        {openConfigId === config.id && (
                                                            <div className="mt-2 bg-white p-2">
                                                                {config.hasScrambleField && (
                                                                    <>
                                                                        <button onClick={() => toggleDetail(`scramble-${config.id}`)}
                                                                            className="w-full text-left bg-gray-100 p-2 font-semibold text-md focus:outline-none">
                                                                            Scramble Field
                                                                            <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openDetailId === `scramble-${config.id}` ? 'rotate-0' : 'rotate-180'}`}>
                                                                                ▼
                                                                            </span>
                                                                        </button>
                                                                        {openDetailId === `scramble-${config.id}` && (
                                                                            <div className="p-2">
                                                                                <h4 className="font-bold">Parameters:</h4>
                                                                                <p>Fields: {config.scrambleFieldFields?.join(', ')}</p>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                                {config.hasDateShift && (
                                                                    <>
                                                                        <button onClick={() => toggleDetail(`dateShift-${config.id}`)}
                                                                            className="w-full text-left bg-gray-100 p-2 font-semibold text-md focus:outline-none">
                                                                            Date Shift
                                                                            <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openDetailId === `dateShift-${config.id}` ? 'rotate-0' : 'rotate-180'}`}>
                                                                                ▼
                                                                            </span>
                                                                        </button>
                                                                        {openDetailId === `dateShift-${config.id}` && (
                                                                            <div className="p-2">
                                                                                <h4 className="font-bold">Parameters:</h4>
                                                                                <p>Low Range: {config.dateShiftLowrange}</p>
                                                                                <p>High Range: {config.dateShiftHighrange}</p>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                                {config.hassubFieldList && (
                                                                    <>
                                                                        <button onClick={() => toggleDetail(`subfieldlist-${config.id}`)}
                                                                            className="w-full text-left bg-gray-100 p-2 font-semibold text-md focus:outline-none">
                                                                            SubField List Replacement
                                                                            <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openDetailId === `subfieldlist-${config.id}` ? 'rotate-0' : 'rotate-180'}`}>
                                                                                ▼
                                                                            </span>
                                                                        </button>
                                                                        {openDetailId === `subfieldlist-${config.id}` && (
                                                                            <div className="p-2">
                                                                                <h4 className="font-bold">Parameters:</h4>
                                                                                <p>Field: {config.subFieldListField}</p>
                                                                                <p>Substitute: {config.subFieldListSubstitute}</p>
                                                                                <p>Replacement: {config.subFieldListReplacement}</p>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                                {config.hassubFieldRegex && (
                                                                    <>
                                                                        <button onClick={() => toggleDetail(`subfieldregex-${config.id}`)}
                                                                            className="w-full text-left bg-gray-100 p-2 font-semibold text-md focus:outline-none">
                                                                            SubField Regex Replacement
                                                                            <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openDetailId === `subfieldregex-${config.id}` ? 'rotate-0' : 'rotate-180'}`}>
                                                                                ▼
                                                                            </span>
                                                                        </button>
                                                                        {openDetailId === `subfieldregex-${config.id}` && (
                                                                            <div className="p-2">
                                                                                <h4 className="font-bold">Parameters:</h4>
                                                                                <p>Field: {config.subFieldRegexField}</p>
                                                                                <p>Regex: {config.subFieldRegexRegex}</p>
                                                                                <p>Replacement: {config.subFieldRegexReplacement}</p>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <hr className="border-t border-gray-300 my-4" />
                                            </>
                                        ))
                                        }
                                    </div>
                                </div>
                            ) : (
                                <p className='fixed right-10 text-gray-500 mt-5 '>No configurations yet</p>
                            )}

                            <div className="flex mt-5 gap-5">
                                <div className="flex flex-col w-full h-full gap-5">
                                    {/* Dataset table preview */}
                                    {metadata && columns && columns[0] ? (
                                        <DataTable
                                            data={columns[0].map((_, rowIndex) => {
                                                let row: Record<string, any> = {}
                                                metadata.forEach((meta, colIndex) => {
                                                    row[`column${meta.columnId}`] = columns[colIndex]?.[rowIndex]
                                                })
                                                return row
                                            })}
                                            columns={metadata?.map((meta, index) => ({
                                                name: `column${meta.columnId}`,
                                                header: meta.columnName ? meta.columnName : `column${index}`,
                                                tooltip: (
                                                    <div className="text-sm" style={{ textTransform: 'none' }}>
                                                        <p><strong>Type:</strong> {meta.type}</p>
                                                        <p><strong>Identifier:</strong> {meta.identifier}</p>
                                                        <p><strong>Is the ID Column:</strong> {meta.isId ? 'Yes' : 'No'}</p>
                                                    </div>
                                                )
                                            }))}
                                        />
                                    ) : (
                                        <div className="text-center text-gray-500 mt-20">The dataset is empty.</div>
                                    )}

                                    <div className='flex justify-start '>
                                        <button
                                            onClick={handleColumnTypeChange}
                                            className={buttonClass}
                                        >
                                            <p className='ml-2 text-md'> Edit Metadata </p>
                                        </button>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div className="p-4 fixed bottom-10 right-0 max-w-xs">
                            <button
                                onClick={() => applyTransformation(selectedConfigId)}
                                disabled={!selectedConfigId}
                                className="mt-4  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300 "
                            >
                                Apply Transformation
                            </button>
                        </div>
                        <Modal show={showCreateModal} onClose={() => closeCreateConfigModal()}>
                            <Modal.Body>
                                <div className="space-y-6">
                                    <h2 className="text-lg font-bold mb-2">New Configuration</h2>
                                    <form onSubmit={handleCreateConfig} className="space-y-4">
                                        {/* Config Name */}
                                        <div>
                                            <label htmlFor="configName" className="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                name="configName"
                                                id="configName"
                                                value={config.configName || ''}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        {/* Date Shift */}
                                        <div>
                                            <label htmlFor="hasDateShift" className="block text-sm font-medium text-gray-700">Has Date Shift</label>
                                            <input type="checkbox" name="hasDateShift" id="hasDateShift" onChange={handleChange} className="mt-1 block" />
                                        </div>
                                        {hasDateShift && <div>
                                            <label htmlFor="dateShiftLowrange" className="block text-sm font-medium text-gray-700">Date shift lower range</label>
                                            <input
                                                type="number"
                                                name="dateShiftLowrange"
                                                id="dateShiftLowrange"
                                                value={dateShiftRange.low}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                min="-30"
                                                max={dateShiftRange.high - 1}  // Ensure this is always less than the high range
                                                step="1"
                                                placeholder="Enter minimum shift"
                                            />
                                            <label htmlFor="dateShiftHighrange" className="block text-sm font-medium text-gray-700">Date shift higher range</label>
                                            <input
                                                type="number"
                                                name="dateShiftHighrange"
                                                id="dateShiftHighrange"
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
                                            <select
                                                multiple
                                                id="scrambleFieldFields"
                                                name="scrambleFieldFields"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={selectedScrambleFields}
                                                onChange={handleMultiSelectChange}
                                            >
                                                {filteredMetadata?.map((item, index) => (
                                                    <option key={index} value={item.columnName}>
                                                        {item.columnName}
                                                    </option>
                                                ))}
                                            </select>
                                            <textarea name="scrambleFieldFields" id="scrambleFieldFields" value={config.scrambleFieldFields?.join(", ")} onChange={handleChange} className="mt-1 block w-full  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            </textarea>
                                        </div>
                                        }
                                        {/* SubField List */}
                                        <div>
                                            <label htmlFor="hassubFieldList" className="block text-sm font-medium text-gray-700">Has Substitute Field List</label>
                                            <input type="checkbox" name="hassubFieldList" id="hassubFieldList" onChange={handleChange} className="mt-1 block" />
                                        </div>
                                        {hassubFieldList && <div>
                                            <label htmlFor="subFieldListField" className="block text-sm font-medium text-gray-700">Substitute Field</label>
                                            {/* <textarea name="subFieldListField" id="subFieldListField" placeholder='sphn:Allergy/id' onChange={handleChange} className="mt-1 block w-1/2  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea> */}
                                            <select
                                                id="subFieldListField"
                                                name="subFieldListField"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={selectedSubListField}
                                                onChange={handleChange}  // This will be updated next
                                            >
                                                {filteredMetadata?.map((item, index) => (
                                                    <option key={index} value={item.columnName}>
                                                        {item.columnName}
                                                    </option>
                                                ))}
                                            </select>
                                            <label htmlFor="subFieldListSubstitute" className="block text-sm font-medium text-gray-700">Values to be substituted (comma-separated)</label>
                                            <textarea name="subFieldListSubstitute" id="subFieldListSubstitute" placeholder='allergy1, allergy2, allergy3' onChange={handleChange} className="mt-1 block w-full  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                                            <label htmlFor="subFieldListReplacement" className="block text-sm font-medium text-gray-700">Replacement string</label>
                                            <textarea name="subFieldListReplacement" id="subFieldListReplacement" placeholder='ALLERGY_ID' onChange={handleChange} className="mt-1 block w-1/2  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                                        </div>
                                        }
                                        {/* SubField Regex */}
                                        <div>
                                            <label htmlFor="hassubFieldRegex" className="block text-sm font-medium text-gray-700">Has Substitute Field Regex</label>
                                            <input type="checkbox" name="hassubFieldRegex" id="hassubFieldRegex" onChange={handleChange} className="mt-1 block" />
                                        </div>
                                        {hassubFieldRegex && <div>
                                            <label htmlFor="subFieldRegexField" className="block text-sm font-medium text-gray-700">Substitute Field</label>
                                            {/* <textarea name="subFieldRegexField" id="subFieldRegexField" placeholder="sphn:Allergy/id" onChange={handleChange} className="mt-1 block w-1/2  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea> */}
                                            <select
                                                id="subFieldRegexField"
                                                name="subFieldRegexField"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={selectedSubRegexField}
                                                onChange={handleChange}  // This will be updated next
                                            >
                                                {filteredMetadata?.map((item, index) => (
                                                    <option key={index} value={item.columnName}>
                                                        {item.columnName}
                                                    </option>
                                                ))}
                                            </select>
                                            <label htmlFor="subFieldRegexRegex" className="block text-sm font-medium text-gray-700">Regex expression to be substituted</label>
                                            <textarea name="subFieldRegexRegex" id="subFieldRegexRegex" placeholder='^allergy[1-3]$' onChange={handleChange} className="mt-1 block w-1/2  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
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
                                    // router.push('dataset');
                                }}>
                                    Cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>

                    </div>
                </>}
        </>
    );
};

export default withAuth(TransformPage);
