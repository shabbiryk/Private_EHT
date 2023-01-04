/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Bloodtest {

    @Property()
    public wbcCount: Number;

    @Property()
    public rbcCount:Number;

    @Property()
    public totalCholestrol:Number

    @Property()
    public lowDensityLipo:Number

    @Property()
    public HighDensityLipo:Number

    @Property()
    public triglycerides:Number



    

}