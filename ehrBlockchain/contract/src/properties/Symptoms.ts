/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Symptoms {

    @Property()
    fainting:Boolean;

    @Property()
    heartBeatRate:Number;

    @Property()
    ChestTightness:Boolean;

    @Property()
    ChestPain:Boolean;

    @Property()
    weight:Number


}