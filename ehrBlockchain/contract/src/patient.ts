/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Patient {

    constructor(patientId,firstName,lastName,emailId,doctorId,password,ehrList){
        this.patientId=patientId;
        this.firstName=firstName;
        this.lastName=lastName;
        this.emailId=emailId;
        this.doctorId=doctorId;
        this.password=password;
        this.ehrList=ehrList;
    }

    @Property()
    public patientId:string;

    @Property()
    public firstName:string;

    @Property()
    public lastName:string;

    @Property()
    public doctorId:string;

    @Property()
    public emailId:string;

    @Property()
    public password:string;

    @Property()
    public ehrList:string;

    

}