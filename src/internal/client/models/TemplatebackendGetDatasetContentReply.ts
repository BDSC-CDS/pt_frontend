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
import type { TemplatebackendGetDatasetContentResult } from './TemplatebackendGetDatasetContentResult';
import {
    TemplatebackendGetDatasetContentResultFromJSON,
    TemplatebackendGetDatasetContentResultFromJSONTyped,
    TemplatebackendGetDatasetContentResultToJSON,
} from './TemplatebackendGetDatasetContentResult';

/**
 * 
 * @export
 * @interface TemplatebackendGetDatasetContentReply
 */
export interface TemplatebackendGetDatasetContentReply {
    /**
     * 
     * @type {TemplatebackendGetDatasetContentResult}
     * @memberof TemplatebackendGetDatasetContentReply
     */
    result?: TemplatebackendGetDatasetContentResult;
}

/**
 * Check if a given object implements the TemplatebackendGetDatasetContentReply interface.
 */
export function instanceOfTemplatebackendGetDatasetContentReply(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendGetDatasetContentReplyFromJSON(json: any): TemplatebackendGetDatasetContentReply {
    return TemplatebackendGetDatasetContentReplyFromJSONTyped(json, false);
}

export function TemplatebackendGetDatasetContentReplyFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendGetDatasetContentReply {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'result': !exists(json, 'result') ? undefined : TemplatebackendGetDatasetContentResultFromJSON(json['result']),
    };
}

export function TemplatebackendGetDatasetContentReplyToJSON(value?: TemplatebackendGetDatasetContentReply | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'result': TemplatebackendGetDatasetContentResultToJSON(value.result),
    };
}

