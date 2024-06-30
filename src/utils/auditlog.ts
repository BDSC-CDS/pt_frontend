import apiClientAuditlog from './apiClientAuditlog';
import { getAuthInitOverrides } from './authContext';

import { TemplatebackendAuditLog } from '../internal/client/index';
import { TemplatebackendGetLogsResponse} from '../internal/client/index';

/**
 * Function to list audit logs.
 *
 * @param offset The offset for pagination.
 * @param limit The limit for pagination.
 * @returns The response from the API or undefined in case of an error.
 */
export const listAuditLogs = async (offset?: number, limit?: number): Promise<TemplatebackendGetLogsResponse | undefined> => {
    const request: { offset?: number; limit?: number } = {};
    if (offset !== undefined) {
        request.offset = offset;
    }
    if (limit !== undefined) {
        request.limit = limit;
    }
    try {
        const response = await apiClientAuditlog.auditLogServiceGetLogs(request, getAuthInitOverrides());
        return response as TemplatebackendGetLogsResponse; // Ensure the response is of type TemplatebackendGetLogsResponse
    } catch (error) {
        console.log("Error listing audit logs: " + error);
    }
};

/**
 * Function to get detailed information of a specific audit log.
 *
 * @param id The ID of the audit log.
 * @returns The response from the API or undefined in case of an error.
 */
// export const getAuditLogDetails = async (id: number) => {
//     try {
//         const response = await apiClientAuditlog.getAuditLogById({ id: id }, getAuthInitOverrides());
//         return response; // Returning the response from the API.
//     } catch (error) {
//         console.log("Error getting audit log details: " + error);
//     }
// };
