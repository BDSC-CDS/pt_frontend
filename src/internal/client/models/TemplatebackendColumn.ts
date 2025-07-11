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
 * @interface TemplatebackendColumn
 */
export interface TemplatebackendColumn {
    /**
     * 
     * @type {Array<string>}
     * @memberof TemplatebackendColumn
     */
    value?: Array<string>;
}

/**
 * Check if a given object implements the TemplatebackendColumn interface.
 */
export function instanceOfTemplatebackendColumn(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendColumnFromJSON(json: any): TemplatebackendColumn {
    return TemplatebackendColumnFromJSONTyped(json, false);
}

export function TemplatebackendColumnFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendColumn {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'value': !exists(json, 'value') ? undefined : json['value'],
    };
}

export function TemplatebackendColumnToJSON(value?: TemplatebackendColumn | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'value': value.value,
    };
}

