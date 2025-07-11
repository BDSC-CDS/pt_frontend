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
import type { TemplatebackendDataset } from './TemplatebackendDataset';
import {
    TemplatebackendDatasetFromJSON,
    TemplatebackendDatasetFromJSONTyped,
    TemplatebackendDatasetToJSON,
} from './TemplatebackendDataset';

/**
 * 
 * @export
 * @interface TemplatebackendGetDatasetInfoReply
 */
export interface TemplatebackendGetDatasetInfoReply {
    /**
     * 
     * @type {TemplatebackendDataset}
     * @memberof TemplatebackendGetDatasetInfoReply
     */
    dataset?: TemplatebackendDataset;
}

/**
 * Check if a given object implements the TemplatebackendGetDatasetInfoReply interface.
 */
export function instanceOfTemplatebackendGetDatasetInfoReply(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendGetDatasetInfoReplyFromJSON(json: any): TemplatebackendGetDatasetInfoReply {
    return TemplatebackendGetDatasetInfoReplyFromJSONTyped(json, false);
}

export function TemplatebackendGetDatasetInfoReplyFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendGetDatasetInfoReply {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'dataset': !exists(json, 'dataset') ? undefined : TemplatebackendDatasetFromJSON(json['dataset']),
    };
}

export function TemplatebackendGetDatasetInfoReplyToJSON(value?: TemplatebackendGetDatasetInfoReply | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'dataset': TemplatebackendDatasetToJSON(value.dataset),
    };
}

