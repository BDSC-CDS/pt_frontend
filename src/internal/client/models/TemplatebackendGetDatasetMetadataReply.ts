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
import type { TemplatebackendGetDatasetMetadataResult } from './TemplatebackendGetDatasetMetadataResult';
import {
    TemplatebackendGetDatasetMetadataResultFromJSON,
    TemplatebackendGetDatasetMetadataResultFromJSONTyped,
    TemplatebackendGetDatasetMetadataResultToJSON,
} from './TemplatebackendGetDatasetMetadataResult';

/**
 * 
 * @export
 * @interface TemplatebackendGetDatasetMetadataReply
 */
export interface TemplatebackendGetDatasetMetadataReply {
    /**
     * 
     * @type {TemplatebackendGetDatasetMetadataResult}
     * @memberof TemplatebackendGetDatasetMetadataReply
     */
    metadata?: TemplatebackendGetDatasetMetadataResult;
}

/**
 * Check if a given object implements the TemplatebackendGetDatasetMetadataReply interface.
 */
export function instanceOfTemplatebackendGetDatasetMetadataReply(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendGetDatasetMetadataReplyFromJSON(json: any): TemplatebackendGetDatasetMetadataReply {
    return TemplatebackendGetDatasetMetadataReplyFromJSONTyped(json, false);
}

export function TemplatebackendGetDatasetMetadataReplyFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendGetDatasetMetadataReply {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': !exists(json, 'metadata') ? undefined : TemplatebackendGetDatasetMetadataResultFromJSON(json['metadata']),
    };
}

export function TemplatebackendGetDatasetMetadataReplyToJSON(value?: TemplatebackendGetDatasetMetadataReply | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': TemplatebackendGetDatasetMetadataResultToJSON(value.metadata),
    };
}

