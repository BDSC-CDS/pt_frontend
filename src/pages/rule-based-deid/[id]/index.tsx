import { useRouter } from "next/router";
import { listTransformConfigs, deleteTransformConfig, exportTransformConfig } from "../../../utils/transformConfig"
import { useEffect, useState } from "react";
import { TemplatebackendTransformConfig, TemplatebackendMetadata } from "~/internal/client";
import { MdOutlineAdd, MdMoreHoriz, MdFileUpload, MdEdit } from "react-icons/md";
import { Button, CustomFlowbiteTheme, ListGroup, Modal, Radio, Table } from "flowbite-react";
import { transformDataset, getMetadata, getDatasetIdentifier, getInfo } from "../../../utils/dataset";
import { saveAs } from "file-saver";
import DataTable from "~/components/DataTable";
import withAuth from "~/components/withAuth";
import { showToast } from "~/utils/showToast";
import DatasetEditMetadataModal from "~/components/modals/DatasetEditMetadataModal";
import TransformConfigCreateModal from "~/components/modals/TransformConfigCreateModal";
import TransformConfigUploadModal from "~/components/modals/TransformConfigUploadModal";
import { CustomTooltip } from "~/components/ui/CustomTooltip";
import Spinner from "~/components/ui/Spinner";

const TransformPage = () => {

    // --------------------- variables --------------------------------- //
    const router = useRouter();
    const { id } = router.query; // Get the dynamic part of the URL
    const datasetId = Number(id);
 
    const [configs, setConfigs] = useState<TemplatebackendTransformConfig[]>([]);
    const [filteredConfigs, setFilteredConfigs] = useState<TemplatebackendTransformConfig[]>([]);

    const [openConfigId, setOpenConfigId] = useState<number | null>(null);
    const [openDetailId, setOpenDetailId] = useState<string | null>(null);
    const [selectedConfigId, setSelectedConfigId] = useState<number>();
    const [metadata, setMetadata] = useState<Array<TemplatebackendMetadata>>([]);
    const [columns, setColumns] = useState<Array<Array<string | undefined> | undefined>>();
    const [nColumns, setNColumns] = useState(0);
    const [nRows, setNRows] = useState<number>(0);

    const [datasetName, setDatasetName] = useState<string>();
    const [createdAt, setCreatedAt] = useState<Date>();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingApply, setIsLoadingApply] = useState<boolean>(false);

    const [showEditMetadataModal, setShowEditMetadataModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);


    // ----------------------------------- methods --------------------------------- //
    const toggleConfig = (id: number | undefined) => {
        if (id) {
            setOpenConfigId(openConfigId === id ? null : id);
        }
    }
    const toggleDetail = (detailId: string) => {
        setOpenDetailId(openDetailId === detailId ? null : detailId);
    }

    const applyTransformation = async (configId: number) => {
        try {
            setIsLoadingApply(true);
            const response = await transformDataset(datasetId, configId);
            if (response?.result && response.result.id) {
                router.push("/dataset/" + response.result.id);
                showToast("success", `Transformed dataset ${response.result.id} sucessfully created.`);
            } else {
                showToast("error", "Error applying transformation.");
            }
        } catch (error) {
            showToast("error", "Error applying transformation: "+ error);
        } finally {
            setIsLoadingApply(false);
        }
    }

    const getDatasetInfo = async () => {
        try {
            setIsLoading(true);
            
            const response = await getInfo(datasetId);
            if (response?.dataset) {
                setDatasetName(response.dataset.datasetName);
                setCreatedAt(response.dataset.createdAt);
            }
        } catch (error) {
            showToast("error", "Error retrieving dataset information: " + error);
        }
        finally {
            setIsLoading(false);
        }
    }

    const getDatasetMetadata = async () => {
        try {
            setIsLoading(true);
            const response = await getMetadata(datasetId);
            if (response?.metadata?.metadata) {
                setMetadata(response.metadata.metadata);
            }
        } catch (error) {
            showToast("error", "Error retrieving dataset metadata: " + error);
        } finally {
            setIsLoading(false);
        }
    }

    const getAndProcessDatasetContent = async () => {
        try {
            setIsLoading(true);
            const response = await getDatasetIdentifier(datasetId, 0, 5)

            if (response && response.result?.columns) {
                const result = response.result?.columns.map((col) => {
                    return col.value;
                })
                if (result) {
                    setColumns(result)
                    setNColumns(result.length);
                }
            }
            if (response && response.result?.nRows) {
                setNRows(response.result.nRows);
            }
        } catch (error) {
            showToast("error", "Error retrieving dataset content: " + error);
        } finally {
            setIsLoading(false);
        }
    }

    const getConfigs = async () => {
        try {
            setIsLoading(true);
            const response = await listTransformConfigs();
            if (response?.result?.configs) {
                setConfigs(response.result.configs);
            } else {
                showToast("error", "Error retrieving configurations.");
            }
        } catch (error) {
            showToast("error", "Error retrieving configurations.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteConfig = async (configId: number | undefined) => {
        if (configId) {
            try {
                setIsLoading(true);
                const response = await deleteTransformConfig(configId);
                if( response?.result?.success) {
                    showToast("success", "Configuration successfully deleted.");
                    setSelectedConfigId(undefined)
                    getConfigs()
                } else {
                    showToast("error", "Failed to delete configuration.");
                }
            } catch (error) {
                showToast("error", "Error deleting the configuration.");
            } finally {
                setIsLoading(false);
            }
        }
    }

    // Handle the export logic
    const handleExportConfig = async (configId: number | undefined) => {
        if (configId) {
            try {
                const response = await exportTransformConfig(configId); // Call backend to get the config as a string
                if (response?.config) {
                    const blob = new Blob([response.config], { type: "application/json" });
                    saveAs(blob, `config_${configId}.json`); // Download the file with the configId as its name
                    showToast("success", "Configuration exported successfully.");
                } else {
                    showToast("error", "Failed to export configuration.");
                }
            } catch (error) {
                showToast("error", "Error exporting the configuration.");
            }
        }
    }

    useEffect(() => {
        if (id) {
            try {
                getDatasetInfo();
                getDatasetMetadata();
                getAndProcessDatasetContent();
            } catch (error) {
                showToast("error", "Error retrieving dataset data.")
            }
        }
    }, [id]);

    // Fetch transform configs
    useEffect(() => {
        if (datasetId) {
            getConfigs();
        }
    }, [id, showCreateModal, showImportModal])

    // Filter the configurations based on the metadata
    useEffect(() => {
        if (metadata?.length && metadata.length > 0 && configs.length > 0) {
            const filtered = configs.filter(config => {
                // Check scrambleFieldFields (if present)
                const isValidScrambleFields = !config.scrambleField || (
                    config.scrambleField.fields?.every(field => {
                        if (field.includes("sphn")) return true; // Skip sphn fields
                        
                        const column = metadata.find(meta => meta.columnName === field);
                        return column?.identifier === "identifier" || column?.identifier === "quasi-identifier";
                    })
                );

                // Check subFieldListField (if present)
                const isValidSubListField = !config.subFieldListList || (
                    config.subFieldListList[0] ? metadata.some(meta =>
                        meta.columnName === config.subFieldListList![0]?.field &&
                        (meta.identifier === "identifier" || meta.identifier === "quasi-identifier")
                    ) : true
                );

                // Check subFieldRegexField (if present)
                const isValidSubRegexField = !config.subFieldRegexList || (
                    config.subFieldRegexList[0] ? metadata.some(meta =>
                        meta.columnName === config.subFieldRegexList![0]?.field &&
                        (meta.identifier === "identifier" || meta.identifier === "quasi-identifier")
                    ) : true
                );

                // Only include configs that pass all these checks
                return isValidScrambleFields && isValidSubListField && isValidSubRegexField;
            });

            setFilteredConfigs(filtered);  // Set the filtered configurations
        }
    }, [configs, metadata]);


    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center">
                <div className="bg-gray-100 p-5 rounded-lg shadow text-md w-1/2">
                    <h2 className="text-lg font-bold mb-2"> {datasetName}</h2>
                    <p><strong>Created Date:</strong> {createdAt?.toLocaleString()} </p>
                    <p><strong>Number of Rows:</strong> {nRows}</p>
                    <p><strong>Number of Columns:</strong> {nColumns} </p>
                </div>

                <div className="flex flex-col gap-2 ">
                    <button
                        className="flex items-center gap-2 p-2 rounded bg-gray-300 hover:bg-gray-200"
                        onClick={() => setShowEditMetadataModal(true)}
                    >
                        <MdEdit />
                        Edit Metadata
                    </button>
                    <button
                        className="flex items-center gap-2 p-2 rounded bg-gray-300 hover:bg-gray-200"
                        onClick={() => setShowImportModal(true)}
                    >
                        <MdFileUpload size={20} />
                        Import Configuration
                    </button>
                </div>
            </div>

            {/* Modals */}
            <DatasetEditMetadataModal 
                show={showEditMetadataModal} 
                datasetId={datasetId} 
                onClose={() => setShowEditMetadataModal(false)}
            />
            <TransformConfigCreateModal 
                show={showCreateModal}
                metadata={metadata}
                onClose={() => setShowCreateModal(false)}
            />
            <TransformConfigUploadModal
                show={showImportModal}
                onClose={() => setShowImportModal(false)}
            />
            
            <div className="flex justify-start items-start">
                {/* Dataset table preview */}
                <div className="flex justify-center items-center w-2/3">
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
                                    <div className="text-sm" style={{ textTransform: "none" }}>
                                        <p><strong>Type:</strong> {meta.type}</p>
                                        <p><strong>Identifier:</strong> {meta.identifier}</p>
                                        <p><strong>Is the ID Column:</strong> {meta.isId ? "Yes" : "No"}</p>
                                    </div>
                                )
                            }))}
                        />
                    ) : (
                        <div className="flex justify-center items-center h-28 w-full">
                            <Spinner/>
                        </div>
                    )}
                </div>                
                
                {/* Configurations */}
                <div className="flex flex-col w-1/3 gap-3 ml-5">
                    <div className="rounded-lg border border-gray-300">
                        <div className="flex items-start font-semibold px-5 py-2 border-b bg-gray-50">
                            Select a configuration
                        </div>
                        
                        {isLoading && (
                            <div className="py-2 border-b">
                                <Spinner/>
                            </div>
                        )}


                        {!isLoading && filteredConfigs && filteredConfigs.length == 0 && (
                            <p className="text-gray-500 px-5 py-2 border-b">No configurations yet.</p>
                        )}

                        {!isLoading && filteredConfigs && filteredConfigs.length > 0 && filteredConfigs?.map((config) => (
                            <div key={`config${config.id}`} className="flex px-5 py-2 gap-2 items-center border-b">
                                <Radio
                                    id={`checkbox-config-${config.id}`}
                                    checked={selectedConfigId === config.id}
                                    onChange={() => setSelectedConfigId(config.id!)} 
                                    className="hover:cursor-pointer focus:ring-0"
                                />
                                <div className="w-full">
                                    <div className="flex">
                                        <button
                                            onClick={() => toggleConfig(config.id)}
                                            className="w-full text-left font-semibold text-md focus:outline-none"
                                        >
                                            {config.name}
                                            <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openConfigId === config.id ? "rotate-0" : "rotate-180"}`}>
                                                ▼
                                            </span>
                                        </button>
                                        <div className="flex justify-start items-center">
                                            <CustomTooltip 
                                                content={
                                                    <ListGroup className="shadow">
                                                        <ListGroup.Item
                                                            key={"action-export" + config.id}
                                                            onClick={() => handleExportConfig(config.id)}
                                                            
                                                        >
                                                            Export
                                                        </ListGroup.Item>
                                                        <ListGroup.Item
                                                            key={"action-delete" + config.id}
                                                            onClick={() => handleDeleteConfig(config.id)}
                                                        >
                                                            Delete
                                                        </ListGroup.Item>
                                                    </ListGroup>} 
                                            >
                                                <MdMoreHoriz size={20}/>
                                            </CustomTooltip>
                    
                                        </div>
                                    </div>

                                    {openConfigId === config.id && (
                                        <div className="mt-2 bg-white p-2">
                                            {config.scrambleField && (
                                                <>
                                                    <button onClick={() => toggleDetail(`scramble-${config.id}`)}
                                                        className="w-full text-left bg-gray-100 p-2 font-semibold text-md focus:outline-none">
                                                        Scramble Field
                                                        <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openDetailId === `scramble-${config.id}` ? "rotate-0" : "rotate-180"}`}>
                                                            ▼
                                                        </span>
                                                    </button>
                                                    {openDetailId === `scramble-${config.id}` && (
                                                        <div className="p-2 text-sm">
                                                            <p><b>Fields:</b> {config.scrambleField.fields?.filter(field => !field.includes("sphn")).join(", ")}</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {config.dateShift && (
                                                <>
                                                    <button onClick={() => toggleDetail(`dateShift-${config.id}`)}
                                                        className="w-full text-left bg-gray-100 p-2 font-semibold text-md focus:outline-none">
                                                        Date shift
                                                        <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openDetailId === `dateShift-${config.id}` ? "rotate-0" : "rotate-180"}`}>
                                                            ▼
                                                        </span>
                                                    </button>
                                                    {openDetailId === `dateShift-${config.id}` && (
                                                        <div className="flex p-2 justify-between text-sm">
                                                            <p><b>Low range:</b> {config.dateShift.lowrange}</p>
                                                            <p><b>High range:</b> {config.dateShift.highrange}</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {config.subFieldListList && (
                                                <>
                                                    <button onClick={() => toggleDetail(`subfieldlist-${config.id}`)}
                                                        className="w-full text-left bg-gray-50 rounded p-2 font-semibold text-md focus:outline-none">
                                                        Substitute field list
                                                        <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openDetailId === `subfieldlist-${config.id}` ? "rotate-0" : "rotate-180"}`}>
                                                            ▼
                                                        </span>
                                                    </button>
                                                    {openDetailId === `subfieldlist-${config.id}` && (
                                                        <Table className="text-sm">
                                                            <Table.Head>
                                                                <Table.HeadCell className="p-2">Field</Table.HeadCell>
                                                                <Table.HeadCell className="p-2">List</Table.HeadCell>
                                                                <Table.HeadCell className="p-2">Replacement</Table.HeadCell>
                                                            </Table.Head>
                                                            <Table.Body className="divide-y">
                                                                {config.subFieldListList.map((subField, i) => (
                                                                    <Table.Row key={`subfield-${i}`}>
                                                                        <Table.Cell className="p-2">{subField.field}</Table.Cell>
                                                                        <Table.Cell className="p-2">{subField.substitutionList}</Table.Cell>
                                                                        <Table.Cell className="p-2">{subField.replacement}</Table.Cell>
                                                                    </Table.Row>
                                                                ))}
                                                            </Table.Body>
                                                        </Table>
                                                    )}
                                                </>
                                            )}
                                            {config.subFieldRegexList && (
                                                <>
                                                    <button onClick={() => toggleDetail(`subfieldregex-${config.id}`)}
                                                        className="w-full text-left bg-gray-100 p-2 font-semibold text-md focus:outline-none">
                                                        Substitute field regex
                                                        <span className={`ml-2 text-gray-400 inline-block transform transition-transform duration-100 ${openDetailId === `subfieldregex-${config.id}` ? "rotate-0" : "rotate-180"}`}>
                                                            ▼
                                                        </span>
                                                    </button>
                                                    {openDetailId === `subfieldregex-${config.id}` && (
                                                        <Table className="text-sm">
                                                            <Table.Head>
                                                                <Table.HeadCell className="p-2">Field</Table.HeadCell>
                                                                <Table.HeadCell className="p-2">Regex</Table.HeadCell>
                                                                <Table.HeadCell className="p-2">Replacement</Table.HeadCell>
                                                            </Table.Head>
                                                            <Table.Body className="divide-y">
                                                                {config.subFieldRegexList.map((subField, i) => (
                                                                    <Table.Row key={`subfieldregex-${i}`}>
                                                                        <Table.Cell className="p-2">{subField.field}</Table.Cell>
                                                                        <Table.Cell className="p-2">{subField.regex}</Table.Cell>
                                                                        <Table.Cell className="p-2">{subField.replacement}</Table.Cell>
                                                                    </Table.Row>
                                                                ))}
                                                            </Table.Body>
                                                        </Table>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div onClick={() => setShowCreateModal(true)} className="flex p-2 justify-center items-center text-gray-500 hover:bg-gray-50 cursor-pointer">
                            <MdOutlineAdd size={20}/>
                        </div>
                    </div>                    

                    <div className="flex justify-center">
                        <Button onClick={() => applyTransformation(selectedConfigId!)} disabled={isLoadingApply || !selectedConfigId} >
                            {isLoadingApply ? <Spinner/> : "Apply Transformation"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuth(TransformPage);
