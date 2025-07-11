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
 * @interface TemplatebackendCreateTransformConfigResult
 */
export interface TemplatebackendCreateTransformConfigResult {
    /**
     * 
     * @type {number}
     * @memberof TemplatebackendCreateTransformConfigResult
     */
    id?: number;
}

/**
 * Check if a given object implements the TemplatebackendCreateTransformConfigResult interface.
 */
export function instanceOfTemplatebackendCreateTransformConfigResult(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendCreateTransformConfigResultFromJSON(json: any): TemplatebackendCreateTransformConfigResult {
    return TemplatebackendCreateTransformConfigResultFromJSONTyped(json, false);
}

export function TemplatebackendCreateTransformConfigResultFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendCreateTransformConfigResult {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
    };
}

export function TemplatebackendCreateTransformConfigResultToJSON(value?: TemplatebackendCreateTransformConfigResult | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
    };
}

