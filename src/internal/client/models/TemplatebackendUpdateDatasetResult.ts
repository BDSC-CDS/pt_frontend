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
 * @interface TemplatebackendUpdateDatasetResult
 */
export interface TemplatebackendUpdateDatasetResult {
    /**
     * 
     * @type {boolean}
     * @memberof TemplatebackendUpdateDatasetResult
     */
    success?: boolean;
}

/**
 * Check if a given object implements the TemplatebackendUpdateDatasetResult interface.
 */
export function instanceOfTemplatebackendUpdateDatasetResult(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendUpdateDatasetResultFromJSON(json: any): TemplatebackendUpdateDatasetResult {
    return TemplatebackendUpdateDatasetResultFromJSONTyped(json, false);
}

export function TemplatebackendUpdateDatasetResultFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendUpdateDatasetResult {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'success': !exists(json, 'success') ? undefined : json['success'],
    };
}

export function TemplatebackendUpdateDatasetResultToJSON(value?: TemplatebackendUpdateDatasetResult | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'success': value.success,
    };
}

