/*
 * SPDX-License-Identifier: Apache-2.0
 */

// Import the necessary modules from the fabric-contract-api library
import { Object, Property } from 'fabric-contract-api';

// Decorate the Patient class with the @Object() decorator
// to indicate that it will be used to define an object in a Hyperledger Fabric blockchain network
@Object()
export class Patient {

    // Constructor for the Patient class
    // It takes in 7 arguments: patientId,firstName,lastName,emailId,doctorId,password,ehrList
    // And initializes the corresponding class properties with these arguments
    constructor(patientId,firstName,lastName,emailId,doctorId,password,ehrList){
        this.patientId=patientId;
        this.firstName=firstName;
        this.lastName=lastName;
        this.emailId=emailId;
        this.doctorId=doctorId;
        this.password=password;
        this.ehrList=ehrList;
    }

    // Property with decorator @Property(), which denotes that this property will be stored
    // in the blockchain and can be accessed or modified by smart contracts that interact with the network
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
