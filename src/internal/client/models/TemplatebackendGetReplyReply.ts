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
import type { TemplatebackendGetReplyResult } from './TemplatebackendGetReplyResult';
import {
    TemplatebackendGetReplyResultFromJSON,
    TemplatebackendGetReplyResultFromJSONTyped,
    TemplatebackendGetReplyResultToJSON,
} from './TemplatebackendGetReplyResult';

/**
 * 
 * @export
 * @interface TemplatebackendGetReplyReply
 */
export interface TemplatebackendGetReplyReply {
    /**
     * 
     * @type {TemplatebackendGetReplyResult}
     * @memberof TemplatebackendGetReplyReply
     */
    result?: TemplatebackendGetReplyResult;
}

/**
 * Check if a given object implements the TemplatebackendGetReplyReply interface.
 */
export function instanceOfTemplatebackendGetReplyReply(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendGetReplyReplyFromJSON(json: any): TemplatebackendGetReplyReply {
    return TemplatebackendGetReplyReplyFromJSONTyped(json, false);
}

export function TemplatebackendGetReplyReplyFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendGetReplyReply {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'result': !exists(json, 'result') ? undefined : TemplatebackendGetReplyResultFromJSON(json['result']),
    };
}

export function TemplatebackendGetReplyReplyToJSON(value?: TemplatebackendGetReplyReply | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'result': TemplatebackendGetReplyResultToJSON(value.result),
    };
}

