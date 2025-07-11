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
import type { TemplatebackendCreateReplyResult } from './TemplatebackendCreateReplyResult';
import {
    TemplatebackendCreateReplyResultFromJSON,
    TemplatebackendCreateReplyResultFromJSONTyped,
    TemplatebackendCreateReplyResultToJSON,
} from './TemplatebackendCreateReplyResult';

/**
 * 
 * @export
 * @interface TemplatebackendCreateReplyReply
 */
export interface TemplatebackendCreateReplyReply {
    /**
     * 
     * @type {TemplatebackendCreateReplyResult}
     * @memberof TemplatebackendCreateReplyReply
     */
    result?: TemplatebackendCreateReplyResult;
}

/**
 * Check if a given object implements the TemplatebackendCreateReplyReply interface.
 */
export function instanceOfTemplatebackendCreateReplyReply(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendCreateReplyReplyFromJSON(json: any): TemplatebackendCreateReplyReply {
    return TemplatebackendCreateReplyReplyFromJSONTyped(json, false);
}

export function TemplatebackendCreateReplyReplyFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendCreateReplyReply {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'result': !exists(json, 'result') ? undefined : TemplatebackendCreateReplyResultFromJSON(json['result']),
    };
}

export function TemplatebackendCreateReplyReplyToJSON(value?: TemplatebackendCreateReplyReply | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'result': TemplatebackendCreateReplyResultToJSON(value.result),
    };
}

