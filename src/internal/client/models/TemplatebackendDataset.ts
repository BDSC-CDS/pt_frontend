/* tslint:disable */
/* eslint-disable */
/**
 * pt backend
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * Contact: development.bdsc@chuv.ch
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface TemplatebackendDataset
 */
export interface TemplatebackendDataset {
    /**
     * 
     * @type {number}
     * @memberof TemplatebackendDataset
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof TemplatebackendDataset
     */
    userid?: number;
    /**
     * 
     * @type {number}
     * @memberof TemplatebackendDataset
     */
    tenantid?: number;
    /**
     * 
     * @type {string}
     * @memberof TemplatebackendDataset
     */
    datasetName?: string;
    /**
     * 
     * @type {string}
     * @memberof TemplatebackendDataset
     */
    originalFilename?: string;
    /**
     * 
     * @type {Date}
     * @memberof TemplatebackendDataset
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof TemplatebackendDataset
     */
    deletedAt?: Date;
}

/**
 * Check if a given object implements the TemplatebackendDataset interface.
 */
export function instanceOfTemplatebackendDataset(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendDatasetFromJSON(json: any): TemplatebackendDataset {
    return TemplatebackendDatasetFromJSONTyped(json, false);
}

export function TemplatebackendDatasetFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendDataset {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'userid': !exists(json, 'userid') ? undefined : json['userid'],
        'tenantid': !exists(json, 'tenantid') ? undefined : json['tenantid'],
        'datasetName': !exists(json, 'datasetName') ? undefined : json['datasetName'],
        'originalFilename': !exists(json, 'originalFilename') ? undefined : json['originalFilename'],
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'deletedAt': !exists(json, 'deletedAt') ? undefined : (new Date(json['deletedAt'])),
    };
}

export function TemplatebackendDatasetToJSON(value?: TemplatebackendDataset | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'userid': value.userid,
        'tenantid': value.tenantid,
        'datasetName': value.datasetName,
        'originalFilename': value.originalFilename,
        'createdAt': value.createdAt === undefined ? undefined : (value.createdAt.toISOString()),
        'deletedAt': value.deletedAt === undefined ? undefined : (value.deletedAt.toISOString()),
    };
}

