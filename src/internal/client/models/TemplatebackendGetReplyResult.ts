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
import type { TemplatebackendQuestionnaireReply } from './TemplatebackendQuestionnaireReply';
import {
    TemplatebackendQuestionnaireReplyFromJSON,
    TemplatebackendQuestionnaireReplyFromJSONTyped,
    TemplatebackendQuestionnaireReplyToJSON,
} from './TemplatebackendQuestionnaireReply';

/**
 * 
 * @export
 * @interface TemplatebackendGetReplyResult
 */
export interface TemplatebackendGetReplyResult {
    /**
     * 
     * @type {TemplatebackendQuestionnaireReply}
     * @memberof TemplatebackendGetReplyResult
     */
    reply?: TemplatebackendQuestionnaireReply;
}

/**
 * Check if a given object implements the TemplatebackendGetReplyResult interface.
 */
export function instanceOfTemplatebackendGetReplyResult(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendGetReplyResultFromJSON(json: any): TemplatebackendGetReplyResult {
    return TemplatebackendGetReplyResultFromJSONTyped(json, false);
}

export function TemplatebackendGetReplyResultFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendGetReplyResult {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'reply': !exists(json, 'reply') ? undefined : TemplatebackendQuestionnaireReplyFromJSON(json['reply']),
    };
}

export function TemplatebackendGetReplyResultToJSON(value?: TemplatebackendGetReplyResult | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'reply': TemplatebackendQuestionnaireReplyToJSON(value.reply),
    };
}

