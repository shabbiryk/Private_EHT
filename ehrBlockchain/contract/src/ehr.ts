/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';
import {Bloodtest} from "./properties/BloodTest"
import {Symptoms} from "./properties/Symptoms"
import {Utils} from "./properties/Util"

@Object()
export class Ehr {

    // The ID of this electronic health record
    @Property()
    public ehrId:string;

    // The ID of the doctor who created this EHR
    @Property()
    public doctorId:string;

    // The ID of the patient associated with this EHR
    @Property()
    public patientId:string;

    // The symptoms the patient is experiencing
    @Property()
    public Symptoms:Symptoms;

    // Any additional information about the patient's health
    @Property()
    public anyOtherProblem:string;

    // The results of the patient's blood test
    @Property()
    public bloodtest:Bloodtest

    // The medicines prescribed to the patient
    @Property()
    public medicines:string

    // Utility functions for this EHR
    @Property()
    public util:Utils
    
    // Feedback from the patient about their experience
    @Property()
    public patientFeedback:string;

}
