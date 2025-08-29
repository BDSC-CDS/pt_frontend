import { Button, Checkbox, Modal, Select, Table, TextInput } from "flowbite-react"
import { useEffect, useState } from "react"
import { TemplatebackendTransformConfig, TemplatebackendMetadata } from "~/internal/client";
import { createTransformConfig } from "~/utils/transformConfig"
import Spinner from "../ui/Spinner";
import { MdCancel, MdOutlineAdd } from "react-icons/md";
import { HiTrash } from "react-icons/hi";
import { showToast } from "~/utils/showToast";
import { set } from "lodash";


interface TransformConfigUploadModalModalProps {
    show: boolean
    onClose: () => void
}

/**
 * Upload rule-based De-Id config modal.
 */
export default function TransformConfigUploadModal({ show, onClose }: TransformConfigUploadModalModalProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [configName, setConfigName] = useState<string>("");
    const [importedConfig, setImportedConfig] = useState<TemplatebackendTransformConfig>({});

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {

            const result = event.target?.result as string
            const jsonConfig = JSON.parse(result)

            const newConfig: TemplatebackendTransformConfig = {
                name: configName || jsonConfig.name || "Imported Config"
            }

            if (jsonConfig.dateShift) {
                newConfig.dateShift = {
                    lowrange: jsonConfig.dateShift.defaultDateShift.low_range,
                    highrange: jsonConfig.dateShift.defaultDateShift.high_range
                }
            }

            if (jsonConfig.scrambleField) {
                newConfig.scrambleField = {
                    fields: jsonConfig.scrambleField.defaultScrambling.applies_to_fields
                }
            }

            if (jsonConfig.substituteFieldList) {                    
                newConfig.subFieldListList = Object.values(jsonConfig.substituteFieldList).map((item: any) => ({
                    name: item.name || "",
                    field: item.applies_to_field || "",
                    substitutionList: Array.isArray(item.substitution_list) 
                        ? item.substitution_list 
                        : [],
                    replacement: item.replacement || ""
                }));
            }

            if (jsonConfig.substituteFieldRegex) {
                newConfig.subFieldRegexList = Object.values(jsonConfig.substituteFieldRegex).map((item: any) => ({
                    name: item.name || "",
                    field: item.applies_to_field || "",
                    regex: item.regex || "",
                    replacement: item.replacement || ""
                }));
            }

            setImportedConfig(newConfig)
        };
        reader.readAsText(file);
        setIsLoading(false);
    };

    const handleImportSubmit = async () => {
        try {
            setIsLoading(true);
            if (!importedConfig.name) {
                showToast("error", "Configuration name is required.");
            }

            const response = await createTransformConfig(importedConfig);
            if (response?.result?.id) {
                showToast("success", "Configuration successfully imported.");
            }
            onClose();
        } catch (error) {
            showToast("error", "Error importing configuration: " + error);
        }
    };
    return (
        <Modal show={show} onClose={onClose}>
            <Modal.Header>Import configuration</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col gap-5 justify-center">
                    {/* Input field for config name */}
                    <div>

                        <input
                            type="text"
                            id="configName"
                            value={configName}
                            onChange={(e) => setConfigName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Name"
                        />
                    </div>

                    {/* File input for uploading JSON */}
                    <input
                        type="file"
                        accept="application/json"
                        onChange={handleFileUpload}
                        className="mb-3 text-base border bg-gray-50 rounded cursor-pointer"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className="flex justify-center gap-3">
                <Button onClick={handleImportSubmit} disabled={!importedConfig}>
                    {isLoading ? <Spinner/> : "Upload"}
                </Button>
                <Button color="gray" onClick={onClose}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )   
}