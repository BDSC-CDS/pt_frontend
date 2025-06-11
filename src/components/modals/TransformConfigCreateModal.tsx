import { Button, Checkbox, Modal, Select, Table, TextInput } from "flowbite-react"
import { useEffect, useState } from "react"
import { TemplatebackendTransformConfig, TemplatebackendMetadata } from "~/internal/client";
import { createTransformConfig } from "~/utils/transformConfig"
import Spinner from "../ui/Spinner";
import { MdCancel, MdOutlineAdd } from "react-icons/md";
import { HiTrash } from "react-icons/hi";
import { showToast } from "~/utils/showToast";

const DEFAULT_SCRAMBLE_FIELDS = `
        sphn:SubjectPseudoIdentifier/sphn:applyIdentifier,
        sphn:AdministrativeCase/sphn:applyIdentifier,
        sphn:Sample/sphn:applyIdentifier,
        sphn:applySample/sphn:applyIdentifier,
        sphn:HealthcareEncounter/sphn:applyIdentifier,
        sphn:Isolate/sphn:applyIdentifier,
        sphn:Code/sphn:applyIdentifier,
        sphn:TumorSpecimen/sphn:applyIdentifier,
        sphn:Assay/sphn:applyIdentifier,
        sphn:Biobanksample/sphn:applyIdentifier,
        sphn:SequencingRun/sphn:applyIdentifier,
        sphn:SequencingAssay/sphn:applyIdentifier
    `.trim()

const DEFAULT_CONFIG: TemplatebackendTransformConfig = {
    name: "",
    dateShift: {
        lowrange: -30,
        highrange: 30
    },
    scrambleField: {
        fields: [],
    },

    subFieldListList: [],

    subFieldRegexList: [],
};

interface TransformConfigCreateModalProps {
    show: boolean
    metadata: TemplatebackendMetadata[]
    // onSubmit: (saveName: string) => void
    onClose: () => void
}

type Field = {
    columnName: string
    type: FieldType
    identifier: FieldIdentifier
}

enum FieldIdentifier {
    NonIdentifying = "non-identifying",
    Identifier = "identifier",
    QuasiIdentifier = "quasi-identifier",
}

enum FieldType {
    String = "string",
    Int = "int",
    Float = "float",
    Date = "date"
}

/**
 * Create rule-based De-Id config modal.
 */
export default function TransformConfigCreateModal({ show, metadata, onClose }: TransformConfigCreateModalProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [scramblableFields, setScramblableFields] = useState<Field[]>()
    const [config, setTransformConfig] = useState<TemplatebackendTransformConfig>({...DEFAULT_CONFIG})
    const [applyDateShift, setApplyDateShift] = useState<boolean>(false)
    const [applyScrambleField, setApplyScrambleField] = useState<boolean>(false)
    const [applySubFieldList, setApplySubFieldList] = useState<boolean>(false)
    const [applySubFieldRegex, setApplySubFieldRegex] = useState<boolean>(false)

    const handleCreateConfig = async () => {
        try {
            setIsLoading(true)
            if(!config.name) {
                showToast("error", "Configuration name is required.")
            } else if (applyDateShift && (!config.dateShift || !config.dateShift.lowrange || !config.dateShift.highrange)) {
                showToast("error", "Invalid date shift range.")
            } else if (applyScrambleField && (!config.scrambleField || !config.scrambleField.fields || config.scrambleField.fields.length === 0)) {
                showToast("error", "At least one field must be selected for scrambling.")
            } else if (applySubFieldList && (!config.subFieldListList || config.subFieldListList.length === 0)) {
                showToast("error", "At least one field with substitution must be defined.")
            } else if (applySubFieldRegex && (!config.subFieldRegexList || config.subFieldRegexList.length === 0)) {
                showToast("error", "At least one field with regex substitution must be defined.")
            } else if (applySubFieldList && (!config.subFieldListList || config.subFieldListList.some(item => !item.field || !item.substitutionList || item.substitutionList.length === 0 || !item.replacement))) {
                showToast("error", "Some fields in the substitution list are empty.")
            } else if (applySubFieldRegex && (!config.subFieldRegexList || config.subFieldRegexList.some(item => !item.field || !item.regex || !item.replacement))) {
                showToast("error", "Some fields in the regex substitution list are empty.")
            } else if (!applyDateShift && !applyScrambleField && !applySubFieldList && !applySubFieldRegex) {
                showToast("error", "At least one transformation must be selected.")  
            } else {
                const newConfig: TemplatebackendTransformConfig = {name: config.name}

                if (applyDateShift) {
                    newConfig.dateShift = config.dateShift
                }
                if (applyScrambleField) {
                    newConfig.scrambleField = config.scrambleField 
                }
                if (applySubFieldList) {
                    newConfig.subFieldListList = config.subFieldListList
                }
                if (applySubFieldRegex) {
                    newConfig.subFieldRegexList = config.subFieldRegexList
                }

                // Add default scramble fields
                if (applyScrambleField) {
                    newConfig.scrambleField = {
                        fields: (config.scrambleField?.fields || []).concat(DEFAULT_SCRAMBLE_FIELDS.split(",").map(field => field.trim()).filter(field => field !== ""))
                    }
                }

                console.log("Creating transform config with:", newConfig)

                const response = await createTransformConfig(newConfig)
                if (response && response.result && response.result.id) {
                    showToast("success", `Configuration ${response.result.id} created successfully.`)
                    handleClose()
                } else {
                    throw new Error("Internal server error.")
                }
            }
        } catch (error) {
            showToast("error", "Error creating the configuration: " + error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleNameChange = (newname: string) => {
        setTransformConfig(prevState => ({
            ...prevState,
            name: newname,
        }))
    }

    const handleDateShiftChange = (lowrange: number, highrange: number) => {
        setTransformConfig(prevState => ({
            ...prevState,
            dateShift: {
                lowrange: lowrange,
                highrange: highrange
            }
        }))
    }

    const handleScrambleFieldChange = (checked: boolean, fieldName: string) => {
        setTransformConfig(prevState => {
            const newFields = checked
                ? [...(prevState.scrambleField?.fields || []), fieldName]
                : prevState.scrambleField?.fields?.filter((f) => f !== fieldName) || []
            return {
                ...prevState,
                scrambleField: {
                    fields: newFields
                }
            }
        })
    }

    const handleSubFieldListChange = (id: number, field: string, substitutionList: string[], replacement: string) => {
        setTransformConfig(prevState => {
            const newList = [...(prevState.subFieldListList || [])]
            if (id < newList.length) {
                newList[id] = { name: `subFieldList${id}`, field: field, substitutionList: substitutionList, replacement: replacement }
            } else {
                newList.push({ name: `subFieldList${id}`, field: field, substitutionList: substitutionList, replacement: replacement })
            }
            return {
                ...prevState,
                subFieldListList: newList
            }
        })
    }

    const handleRemoveSubFieldList = (id: number) => {
        setTransformConfig(prevState => {
            const newList = [...(prevState.subFieldListList || [])]
            if (id < newList.length) {
                newList.splice(id, 1)
            }
            return {
                ...prevState,
                subFieldListList: newList
            }
        })
    }

    const handleSubFieldRegexChange = (id: number, field: string, regex: string, replacement: string) => {
        setTransformConfig(prevState => {
            const newList = [...(prevState.subFieldRegexList || [])]
            if (id < newList.length) {
                newList[id] = { name: `subFieldRegex${id}`, field: field, regex: regex, replacement: replacement }
            } else {
                newList.push({ name: `subFieldRegex${id}`, field: field, regex: regex, replacement: replacement })
            }
            return {
                ...prevState,
                subFieldRegexList: newList
            }
        })
    }

    const handleRemoveSubFieldRegex = (id: number) => {
        setTransformConfig(prevState => {
            const newList = [...(prevState.subFieldRegexList || [])]
            if (id < newList.length) {
                newList.splice(id, 1)
            }
            return {
                ...prevState,
                subFieldRegexList: newList
            }
        })
    }

    const handleClose = () => {
        setTransformConfig({...DEFAULT_CONFIG})
        setApplyDateShift(false)
        setApplyScrambleField(false)
        setApplySubFieldList(false)
        setApplySubFieldRegex(false)
        setScramblableFields([])
        onClose()
    }

    useEffect(() => {
        console.log("Transform config state:", config)
    }, [config])

    useEffect(() => {
        const fields = metadata.filter((item) => {
            const type = item.type as FieldType
            const identifier = item.identifier as FieldIdentifier

            if(type === FieldType.String || type === FieldType.Int || type === FieldType.Float || type === FieldType.Date) {
                if(identifier === FieldIdentifier.Identifier || identifier === FieldIdentifier.QuasiIdentifier) {
                    return true
                }
            }
            return false
        }).map((item) => ({
            columnName: item.columnName || "",
            type: item.type as FieldType,
            identifier: item.identifier as FieldIdentifier
        }))
        setScramblableFields(fields)
        console.log("Scramblable fields:", scramblableFields)
    }, [metadata, show])

    return (
        <Modal show={show} onClose={handleClose} size={applySubFieldList || applySubFieldRegex ? "4xl" : "3xl"} className="overflow-y-auto">
            <Modal.Header>Create new configuration</Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleCreateConfig()
                        }} 
                        className="space-y-4"
                    >

                        {/* Config Name */}
                        <div>
                            <TextInput
                                id="configName"
                                name="configName"
                                placeholder="Name"
                                onChange={(e) => handleNameChange(e.target.value)}
                                value={config.name}
                            />
                        </div>

                        <hr/>

                        {/* Date Shift */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center">
                                <Checkbox 
                                    id="applyDateShift" 
                                    checked={applyDateShift}
                                    onChange={(e) => setApplyDateShift(e.target.checked)} 
                                    className="hover:cursor-pointer focus:ring-0"
                                />
                                <label htmlFor="applyDateShift" className="pl-2 font-medium text-gray-700 hover:cursor-pointer">Apply Date Shifting</label>
                            </div>
                            { applyDateShift && 
                                <div className="mx-10 flex gap-10 justify-center">
                                    <div className="">
                                        <label htmlFor="dateShiftLowrange" className="block text-sm text-gray-700">Lower range (days)</label>
                                        <input
                                            type="number"
                                            id="dateShiftLowrange"
                                            value={config.dateShift?.lowrange}
                                            onChange={(e) => handleDateShiftChange(parseInt(e.target.value, 10), config.dateShift?.highrange || 30)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            max={(config.dateShift?.highrange || 0) - 1}
                                            step="1"
                                            placeholder="Minimum shift"
                                        />
                                    </div>
                                    <div className="">
                                        <label htmlFor="dateShiftHighrange" className="block text-sm text-gray-700">Higher range (days)</label>
                                        <input
                                            type="number"
                                            id="dateShiftHighrange"
                                            value={config.dateShift?.highrange}
                                            onChange={(e) => handleDateShiftChange(config.dateShift?.lowrange || -30, parseInt(e.target.value, 10))}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            min={(config.dateShift?.lowrange || 0) + 1}
                                            step="1"
                                            placeholder="Maximum shift"
                                        />
                                    </div>
                                </div>
                            }
                        </div>

                        <hr/>
                        
                        {/* Scramble Fields */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center">
                                <Checkbox 
                                    id="applyScrambleField" 
                                    checked={applyScrambleField}
                                    onChange={(e) => setApplyScrambleField(e.target.checked)} 
                                    className="hover:cursor-pointer focus:ring-0"
                                />
                                <label htmlFor="applyScrambleField" className="pl-2 font-medium text-gray-700 hover:cursor-pointer">Apply Fields Scrambling</label>
                            </div>
                            { applyScrambleField && 
                                <div className="mx-14">
                                    <div className="px-4 py-2 text-sm border rounded-md shadow-sm overflow-auto max-h-44">
                                        { scramblableFields && scramblableFields.length > 0 && scramblableFields.map((field, index) => (
                                            <div key={index} className="flex items-center">
                                                <Checkbox
                                                    id={`scrambleField-${index}`}
                                                    className="hover:cursor-pointer focus:ring-0"
                                                    color={"gray"}
                                                    checked={config.scrambleField?.fields?.includes(field.columnName)}
                                                    onChange={(e) => handleScrambleFieldChange(e.target.checked, field.columnName)}
                                                />
                                                <label htmlFor={`scrambleField-${index}`} className="pl-2 text-gray-700 hover:cursor-pointer">{field.columnName} ({field.identifier})</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                        </div>
                    
                        <hr/>

                        {/* SubField List */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center">
                                <Checkbox 
                                    id="applysubFieldList" 
                                    name="applysubFieldList"
                                    checked={applySubFieldList}
                                    onChange={(e) => setApplySubFieldList(e.target.checked)} 
                                    className="hover:cursor-pointer focus:ring-0"
                                />
                                <label htmlFor="applysubFieldList" className="pl-2 font-medium text-gray-700 hover:cursor-pointer">Apply String Substitution</label>
                            </div>

                            {applySubFieldList &&
                                <div className="mx-2 border rounded-md">
                                    <Table className="w-full">
                                        <Table.Head>
                                            <Table.HeadCell>Field</Table.HeadCell>
                                            <Table.HeadCell>Values to replace</Table.HeadCell>
                                            <Table.HeadCell>Replacement</Table.HeadCell>
                                            <Table.HeadCell className="p-0 pr-3"></Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y">
                                        { config.subFieldListList?.map((item, index) => (
                                            <Table.Row key={`subFieldList-${index}`}>
                                                <Table.Cell className="w-1/3">
                                                    <Select
                                                        id={`subFieldListField-${index}`}
                                                        value={item.field || ""}
                                                        onChange={(e) => handleSubFieldListChange(index, e.target.value, item.substitutionList || [], item.replacement || "")}
                                                        className="w-full"
                                                        color={"gray"}
                                                        sizing={"sm"}
                                                        required
                                                    >
                                                        <option value="">Select field</option>
                                                        {metadata.map((field, idx) => (
                                                            <option key={idx} value={field.columnName}>
                                                                {field.columnName} ({field.type})
                                                            </option>
                                                        ))}
                                                        
                                                    </Select>
                                                </Table.Cell>
                                                <Table.Cell className="flex flex-col gap-1">
                                                    { item.substitutionList && item.substitutionList.map((value, valueIndex) => {
                                                        return (
                                                            <div key={`substitution-${index}-${valueIndex}`} className="flex justify-center items-center gap-1">
                                                                { item.substitutionList && item.substitutionList.length > 1 &&
                                                                    <div className="p-1 text-sm" >
                                                                        <MdCancel 
                                                                            className="text-gray-400 hover:text-red-500 cursor-pointer"
                                                                            onClick={() => handleSubFieldListChange(index, item.field || "", item.substitutionList?.filter((_, i) => i !== valueIndex) || [], item.replacement || "")}
                                                                        />
                                                                    </div>
                                                                }
                                                                <TextInput
                                                                    id={`subFieldListSubstitution-${index}-${valueIndex}`}
                                                                    placeholder={`Value ${valueIndex + 1}`}
                                                                    value={value}
                                                                    onChange={(e) => {
                                                                        const newSubstitutionList = [...(item.substitutionList || [])]
                                                                        newSubstitutionList[valueIndex] = e.target.value
                                                                        handleSubFieldListChange(index, item.field || "", newSubstitutionList, item.replacement || "")
                                                                    }}
                                                                    className="w-full"
                                                                    sizing={"sm"}
                                                                    color={"gray"}
                                                                    required
                                                                />
                                                                { valueIndex === item.substitutionList!.length - 1 && (
                                                                    <div className="rounded p-1 text-sm gap-2 cursor-pointer hover:bg-gray-100 " onClick={() => handleSubFieldListChange(index, item.field || "", [...(item.substitutionList || []), ""], item.replacement || "")}>
                                                                        <MdOutlineAdd
                                                                            size={15}
                                                                            className="text-gray-500"
                                                                        />
                                                                    </div>
                                                                )}
                                                                
                                                          </div>
                                                        )
                                                    })}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <TextInput
                                                        id={`subFieldListReplacement-${index}`}
                                                        placeholder="Replacement"
                                                        value={item.replacement || ""}
                                                        onChange={(e) => handleSubFieldListChange(index, item.field || "", item.substitutionList || [], e.target.value)}
                                                        className="w-full"
                                                        sizing={"sm"}
                                                        color={"gray"}
                                                        required
                                                    />
                                                </Table.Cell>
                                                <Table.Cell className="p-1 pr-4">
                                                    <div className="p-1 flex justify-center items-center text-sm gap-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleRemoveSubFieldList(index)}>
                                                        <HiTrash
                                                        size={15}
                                                        className="text-gray-500"
                                                    />
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        )).concat(
                                            <Table.Row key="add-new">
                                                <Table.Cell colSpan={4} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleSubFieldListChange(config.subFieldListList?.length || 0, "", [""], "")}>
                                                    <div className="flex justify-center items-center text-sm gap-2">
                                                        <MdOutlineAdd size={20}/>
                                                        <span>Add substitution</span>
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                        </Table.Body>
                                    </Table>
                                </div>
                            }
                        </div>

                        <hr/>

                        {/* SubField Regex */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center">
                                <Checkbox 
                                    id="applysubFieldRegex" 
                                    checked={applySubFieldRegex}
                                    onChange={(e) => setApplySubFieldRegex(e.target.checked)} 
                                    className="hover:cursor-pointer focus:ring-0"
                                />
                                <label htmlFor="applysubFieldRegex" className="pl-2 font-medium text-gray-700 hover:cursor-pointer">Apply Regex Substitution</label>
                            </div>
                            { applySubFieldRegex &&
                                <div className="mx-2 border rounded-md">
                                    <Table className="w-full">
                                        <Table.Head>
                                            <Table.HeadCell>Field</Table.HeadCell>
                                            <Table.HeadCell>Regex</Table.HeadCell>
                                            <Table.HeadCell>Replacement</Table.HeadCell>
                                            <Table.HeadCell className="p-0 pr-3"></Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y">
                                        { config.subFieldRegexList?.map((item, index) => (
                                            <Table.Row key={`subFieldRegex-${index}`}>
                                                <Table.Cell className="w-1/3">
                                                    <Select
                                                        id={`subFieldRegexField-${index}`}
                                                        value={item.field || ""}
                                                        onChange={(e) => handleSubFieldRegexChange(index, e.target.value, item.regex || "", item.replacement || "")}
                                                        className="w-full"
                                                        color={"gray"}
                                                        sizing={"sm"}                                                    >
                                                        <option value="">Select field</option>
                                                        {metadata.map((field, idx) => (
                                                            <option key={idx} value={field.columnName}>
                                                                {field.columnName} ({field.type})
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </Table.Cell>
                                                <Table.Cell className="flex flex-col gap-1">
                                                    <TextInput
                                                        id={`subFieldRegexSubstitution-${index}`}
                                                        placeholder="Regex"
                                                        value={item.regex || ""}
                                                        onChange={(e) => handleSubFieldRegexChange(index, item.field || "", e.target.value, item.replacement || "")}
                                                        className="w-full"
                                                        sizing={"sm"}
                                                        color={"gray"}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <TextInput
                                                        id={`subFieldRegexReplacement-${index}`}
                                                        placeholder="Replacement"
                                                        value={item.replacement || ""}
                                                        onChange={(e) => handleSubFieldRegexChange(index, item.field || "", item.regex || "", e.target.value)}
                                                        className="w-full"
                                                        sizing={"sm"}
                                                        color={"gray"}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell className="p-1 pr-4">
                                                    <div className="p-1 flex justify-center items-center text-sm gap-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleRemoveSubFieldRegex(index)}>
                                                        <HiTrash
                                                        size={15}
                                                        className="text-gray-500"
                                                    />
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        )).concat(
                                            <Table.Row key="add-new">
                                                <Table.Cell colSpan={4} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleSubFieldRegexChange(config.subFieldRegexList?.length || 0, "", "", "")}>
                                                    <div className="flex justify-center items-center text-sm gap-2">
                                                        <MdOutlineAdd size={20}/>
                                                        <span>Add substitution</span>
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                        </Table.Body>
                                    </Table>
                                </div>
                            }
                        </div>
                    </form>

                </div>

            </Modal.Body>
            <Modal.Footer className="flex justify-center gap-3">
                <Button onClick={handleCreateConfig} disabled={isLoading}>
                    {isLoading ? <Spinner /> : "Create"}
                </Button>
                <Button color="gray" onClick={handleClose}>Cancel</Button>
            </Modal.Footer>
            
        </Modal>
    )   
}