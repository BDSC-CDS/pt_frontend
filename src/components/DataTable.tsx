import { CustomFlowbiteTheme, Flowbite, ListGroup, Table, Tooltip } from "flowbite-react";
import { ElementType, ReactNode} from "react";
import { MdMoreHoriz, MdOutlineAdd } from "react-icons/md";

// Custom theme for Flowbite components
const customTheme: CustomFlowbiteTheme = {
    "table": {
        "root": {
            "base": "w-full text-left text-sm text-gray-500 dark:text-gray-400",
            "shadow": "absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-white drop-shadow-md dark:bg-black",
            "wrapper": "relative"
        },
        "body": {
            "base": "group/body",
            "cell": {
                "base": "px-6 py-4 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg truncate"
            }
        },
        "head": {
            "base": "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
            "cell": {
                "base": "bg-gray-50 px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700"
            }
        },
        "row": {
            "base": "group/row",
            "hovered": "hover:bg-gray-100 dark:hover:bg-gray-600",
            "striped": "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700"
        }
    },
    "listGroup": {
        "root": {
            "base": "list-none rounded-lg border border-gray-200 bg-white text-right text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        },
        "item": {
            "base": "[&>*]:first:rounded-t-lg [&>*]:last:rounded-b-lg [&>*]:last:border-b-0",
            "link": {
                "base": "flex w-full items-center border-b border-gray-200 px-4 py-2 dark:border-gray-600",
                "active": {
                    "off": "hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500",
                    "on": "text-white dark:bg-gray-800"
                },
                "icon": "mr-2 h-4 w-4 fill-current"
            }
        }
    }
}

// Interface definition for props
interface DataTableProps<T> {
    data: T[],
    columns: {
        name: string;
        header: string;
        tooltip?: ReactNode;
    }[];
    onRowClick?: (row: T) => void;
    iconActions?: {
        Icon: ElementType;
        tooltip: string;
        callback: (row: T) => void;
    }[];
    actions?: {
        name: string;
        callback: (row: T) => void;
    }[];
    addRow?: boolean;
    onAddRowClick?: () => void;
};

// Utility function to render cell values
const renderCell = (value: any): React.ReactNode => {
    if (value instanceof Date) {
      return value.toLocaleDateString(); // Format Date if it's a Date object
    }
    return value; // Otherwise, return the value as is
};


/**
 * DataTable component 
 */
const DataTable = <T extends {}>({ 
    data,
    columns,
    onRowClick,
    iconActions,
    actions,
    addRow,
    onAddRowClick,
}: DataTableProps<T>): JSX.Element => {
    return (
        <Flowbite theme={{theme: customTheme}}>
            <div className="w-full border overflow-x-auto border-gray-200 rounded-lg">
                <Table hoverable={!!onRowClick}>
                    {/* DataTable Header */}
                    <Table.Head>
                        {iconActions && <Table.HeadCell className="w-1"/>}
                        {columns.map((col, colIndex) => (
                            <Table.HeadCell key={col.name}>
                                {col.tooltip && (
                                    <Tooltip content={col.tooltip}>
                                        <span className="cursor-pointer">{col.header}</span>
                                    </Tooltip>
                                )}
                                {!col.tooltip && col.header}
                            </Table.HeadCell>
                        ))}
                        {actions && <Table.HeadCell className="w-1"/>}
                    </Table.Head>

                    {/* DataTable Body */}
                    <Table.Body className={`divide-y ${onRowClick?"cursor-pointer":""}`}>
                        {data.map((row, rowIndex) => (
                            <Table.Row 
                                key={rowIndex} 
                                onClick={() => onRowClick?.(row)} 
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                                {(iconActions) && (
                                    <Table.Cell key="iconActionCell" className="p-0" onClick={(e) => e.stopPropagation()}>
                                        {/* Render icon actions */}
                                        <div className="flex items-center justify-center">
                                            {iconActions && (
                                                <div>
                                                    {iconActions.map((iconAction, actionIndex) => (
                                                        <div key={`iconAction${actionIndex}`} className="p-1 rounded-md hover:bg-gray-200" onClick={() => iconAction.callback(row)}>
                                                            <Tooltip content={iconAction.tooltip} style="light" className="text-sm p-2">
                                                                <iconAction.Icon className="text-lg"/>
                                                            </Tooltip>
                                                        </div>
                                                        
                                                    ))}

                                                </div>
                                            )}
                                        </div>
                                        
                                    </Table.Cell>
                                )}
                                {/* Render data row cells */}
                                {columns.map((col, colIndex) => (
                                    <Table.Cell 
                                        key={"cell"+rowIndex+colIndex}
                                        className=""
                                    >
                                        {renderCell(row[col.name as keyof T])}
                                    </Table.Cell>
                                ))}       

                                {(actions) && (
                                    <Table.Cell key="actionCell" onClick={(e) => e.stopPropagation()}>
                                        {/* Render actions list */}
                                        <div className="flex items-center gap-3 justify-center">
                                            {actions && (
                                                <Tooltip 
                                                    content={
                                                        <ListGroup className="shadow">
                                                            {actions.map((action, actionIndex) => (
                                                                <ListGroup.Item
                                                                    key={"action" + actionIndex}
                                                                    onClick={() => action.callback(row)}
                                                                >
                                                                    {action.name}
                                                                </ListGroup.Item>
                                                            ))}
                                                        </ListGroup>} 
                                                    placement="bottom" 
                                                    style="light"
                                                    className="border-0 p-0"
                                                >
                                                    <MdMoreHoriz size={20}/>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </Table.Cell>
                                )}      
                            </Table.Row>
                        )).concat( addRow ? (
                            // Add a row at the end of the table
                            <Table.Row key="addRow" className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell colSpan={columns.length + (iconActions ? 1 : 0) + (actions ? 1 : 0)} className="hover:bg-gray-100 cursor-pointer" onClick={onAddRowClick}>
                                    <div className="flex justify-center items-center text-sm gap-2">
                                        <MdOutlineAdd size={20}/>
                                        <span>New dataset</span>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ): [])}
                    </Table.Body>
                </Table>
            </div>
        </Flowbite>
    );
}

export default DataTable;