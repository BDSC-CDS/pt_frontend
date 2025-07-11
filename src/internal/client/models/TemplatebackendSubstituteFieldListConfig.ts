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
 * @interface TemplatebackendSubstituteFieldListConfig
 */
export interface TemplatebackendSubstituteFieldListConfig {
    /**
     * 
     * @type {string}
     * @memberof TemplatebackendSubstituteFieldListConfig
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof TemplatebackendSubstituteFieldListConfig
     */
    field?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof TemplatebackendSubstituteFieldListConfig
     */
    substitutionList?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof TemplatebackendSubstituteFieldListConfig
     */
    replacement?: string;
}

/**
 * Check if a given object implements the TemplatebackendSubstituteFieldListConfig interface.
 */
export function instanceOfTemplatebackendSubstituteFieldListConfig(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendSubstituteFieldListConfigFromJSON(json: any): TemplatebackendSubstituteFieldListConfig {
    return TemplatebackendSubstituteFieldListConfigFromJSONTyped(json, false);
}

export function TemplatebackendSubstituteFieldListConfigFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendSubstituteFieldListConfig {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'field': !exists(json, 'field') ? undefined : json['field'],
        'substitutionList': !exists(json, 'substitutionList') ? undefined : json['substitutionList'],
        'replacement': !exists(json, 'replacement') ? undefined : json['replacement'],
    };
}

export function TemplatebackendSubstituteFieldListConfigToJSON(value?: TemplatebackendSubstituteFieldListConfig | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'field': value.field,
        'substitutionList': value.substitutionList,
        'replacement': value.replacement,
    };
}

