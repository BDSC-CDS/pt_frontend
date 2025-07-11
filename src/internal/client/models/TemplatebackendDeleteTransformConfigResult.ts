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
 * @interface TemplatebackendDeleteTransformConfigResult
 */
export interface TemplatebackendDeleteTransformConfigResult {
    /**
     * 
     * @type {boolean}
     * @memberof TemplatebackendDeleteTransformConfigResult
     */
    success?: boolean;
}

/**
 * Check if a given object implements the TemplatebackendDeleteTransformConfigResult interface.
 */
export function instanceOfTemplatebackendDeleteTransformConfigResult(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendDeleteTransformConfigResultFromJSON(json: any): TemplatebackendDeleteTransformConfigResult {
    return TemplatebackendDeleteTransformConfigResultFromJSONTyped(json, false);
}

export function TemplatebackendDeleteTransformConfigResultFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendDeleteTransformConfigResult {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'success': !exists(json, 'success') ? undefined : json['success'],
    };
}

export function TemplatebackendDeleteTransformConfigResultToJSON(value?: TemplatebackendDeleteTransformConfigResult | null): any {
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

