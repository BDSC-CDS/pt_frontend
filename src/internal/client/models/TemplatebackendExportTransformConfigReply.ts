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
 * @interface TemplatebackendExportTransformConfigReply
 */
export interface TemplatebackendExportTransformConfigReply {
    /**
     * 
     * @type {string}
     * @memberof TemplatebackendExportTransformConfigReply
     */
    config?: string;
}

/**
 * Check if a given object implements the TemplatebackendExportTransformConfigReply interface.
 */
export function instanceOfTemplatebackendExportTransformConfigReply(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendExportTransformConfigReplyFromJSON(json: any): TemplatebackendExportTransformConfigReply {
    return TemplatebackendExportTransformConfigReplyFromJSONTyped(json, false);
}

export function TemplatebackendExportTransformConfigReplyFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendExportTransformConfigReply {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'config': !exists(json, 'config') ? undefined : json['config'],
    };
}

export function TemplatebackendExportTransformConfigReplyToJSON(value?: TemplatebackendExportTransformConfigReply | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'config': value.config,
    };
}

