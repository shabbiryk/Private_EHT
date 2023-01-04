/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Ehr } from './ehr';
import { Doctor } from './doctor';
import { Symptoms } from './properties/Symptoms';
import { Bloodtest } from './properties/BloodTest';
import { Utils } from './properties/Util';
import { Patient } from './patient';

@Info({title: 'EhrContract', description: 'My Smart Contract' })
export class EhrContract extends Contract {



  // methods to check existence

    @Transaction(false)
    @Returns('boolean')
    public async ehrExists(ctx: Context, args: string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.ehrId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction(false)
    @Returns('boolean')
    public async patientExists(ctx: Context, args: string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.patientId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction(false)
    @Returns('boolean')
    public async doctorExists(ctx: Context, args:string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.doctorId);
        return (!!buffer && buffer.length > 0);
    }


    // methods to get user i.e doctor or patient


    @Transaction(false)
    @Returns('string')
    public async getPatient(ctx: Context, args: string): Promise<string> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.patientId);
        return buffer.toString();
    }

    @Transaction(false)
    @Returns('string')
    public async getDoctor(ctx: Context, args: string): Promise<string> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.doctorId);
        return buffer.toString();
    }

    // methods for password related queries

    @Transaction(false)
    @Returns('boolean')
    public async checkDoctorPassword(ctx: Context, args:string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.doctorId);
        let doctor=JSON.parse(buffer.toString());
        return doctor.password==newObj.password;
    }

    @Transaction(false)
    @Returns('boolean')
    public async checkPatientPassword(ctx: Context, args:string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.patientId);
        let patient=JSON.parse(buffer.toString());
        return newObj.password==patient.password;
    }

    @Transaction(false)
    @Returns('boolean')
    public async patientHasPassword(ctx: Context, args:string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.patientId);
        let patient=JSON.parse(buffer.toString());
        return typeof patient.password=="string";
    }

    @Transaction()
    public async setPatientPassword(ctx:Context,args:string):Promise<Boolean>{
        let newArgs=JSON.parse(args);

        let patient=await ctx.stub.getState(newArgs.patientId)
        let patientJson=JSON.parse(patient.toString());
        patientJson.password=newArgs.password;
        await ctx.stub.putState(newArgs.patientId, Buffer.from(JSON.stringify(patientJson)));
        return true;
    }

    

    // CRUD of ehr





    @Transaction()
    public async createEhr(ctx: Context,args:string): Promise<Boolean> {
      let argsJSON=JSON.parse(args) as Ehr;

        let patientExists=await this.patientExists(ctx,args);
        if(!patientExists)throw new Error("patient does not exist");

        let ehrExists=await this.ehrExists(ctx,args);
        if(
          ehrExists)throw new Error("Ehr with the same ID already exists");

        let doctorExists=await this.doctorExists(ctx,args);
        if(!doctorExists)throw new Error('doctor does not exist');
        
        const ehr = new Ehr();
        ehr.doctorId=argsJSON.doctorId;
        ehr.patientId=argsJSON.patientId;
        ehr.Symptoms=JSON.parse(JSON.stringify(argsJSON.Symptoms)) as Symptoms;
        ehr.anyOtherProblem=argsJSON.anyOtherProblem;
        ehr.bloodtest=JSON.parse(JSON.stringify(argsJSON.bloodtest)) as Bloodtest;
        ehr.medicines=argsJSON.medicines;
        ehr.util=JSON.parse(JSON.stringify(argsJSON.util)) as Utils;
        ehr.patientFeedback=argsJSON.patientFeedback;
        ehr.ehrId=argsJSON.ehrId;

        await this.addEhrToPatient(ctx,args);

        const buffer = Buffer.from(JSON.stringify(ehr));
        await ctx.stub.putState(argsJSON.ehrId, buffer);
        return true;
    }

    @Transaction()
    public async addEhrToPatient(ctx: Context, args: string){
      let newArgs=JSON.parse(args);
      let patient=await this.getPatient(ctx,args);
      let patientJson=JSON.parse(patient);
      let ehrList=JSON.parse(patientJson.ehrList);
      ehrList.push(newArgs.ehrId);
      patientJson.ehrList=JSON.stringify(ehrList);
      await ctx.stub.putState(patientJson.patientId, Buffer.from(JSON.stringify(patientJson)));
    }

    

    @Transaction(false)
    @Returns('Ehr')
    public async readEhr(ctx: Context, ehrId: string): Promise<Ehr> {
        const buffer = await ctx.stub.getState(ehrId);
        const ehr = JSON.parse(buffer.toString()) as Ehr;
        return ehr;
    }

    @Transaction()
    public async updateEhr(ctx: Context, ehrId: string, newValue: string): Promise<Boolean> {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        const ehr = new Ehr();
        
        const buffer = Buffer.from(JSON.stringify(ehr));
        await ctx.stub.putState(ehrId, buffer);
        return true;
    }

    @Transaction()
    public async updateDoctorForPatient(ctx: Context,args:string): Promise<Boolean> {
        let patient= await this.getPatient(ctx,args);
        let patientJson=JSON.parse(patient);
        let argsJSON=JSON.parse(args);
        patientJson.doctorId=argsJSON.doctorId;
        const buffer = Buffer.from(JSON.stringify(patientJson));
        await ctx.stub.putState(argsJSON.patientId, buffer);
        return true;
    }

    @Transaction()
    public async deleteEhr(ctx: Context, ehrId: string): Promise<Boolean> {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        await ctx.stub.deleteState(ehrId);
        return true;
    }

    // utility functions

    @Transaction(false)
    @Returns('string')
    public async getMailIdOfPatient(ctx: Context, args:string): Promise<string> {
        let newObj=JSON.parse(args);
        let patient=await this.patientExists(ctx,args);
        if(!patient){throw new Error("patient not registered")}
        else
        {
          const buffer = await ctx.stub.getState(newObj.patientId);
          let patientJson=JSON.parse(buffer.toString());
          let mail=patientJson.emailId;
          return mail;
        }
        
        
    }

    @Transaction(false)
    @Returns('string')
    public async checkUsernamePresence(ctx: Context, args:string): Promise<string> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.id);
        let user=buffer.toString();
        return user;
    }

    @Transaction()
    public async updateDoctorOnEhr(ctx: Context, args:string): Promise<Boolean> {
        let argsJSON=JSON.parse(args);
        const exists = await this.ehrExists(ctx, argsJSON.ehrId);
        if (!exists) {
            throw new Error(`The ehr ${argsJSON.ehrId} does not exist`);
        }
        let buffer = await ctx.stub.getState(argsJSON.ehrId);
        let newJson=JSON.parse(buffer.toString())
        newJson.doctorId = argsJSON.doctorId;
        buffer = Buffer.from(JSON.stringify(newJson));
        await ctx.stub.putState(argsJSON.ehrId, buffer);
        return true;
    }

    

    // creation of user


    @Transaction()
    public async createDoctor(ctx:Context,args:string):Promise<Boolean>{
        let newArgs=JSON.parse(args);
        let newDoctor=new Doctor(newArgs.doctorId,newArgs.firstName,newArgs.lastName,newArgs.password,newArgs.patientList,newArgs.doctorRegNumber);
        await ctx.stub.putState(newDoctor.doctorId, Buffer.from(JSON.stringify(newDoctor)));
        return true;
    }

   


    @Transaction()
    public async addPatientToDoctorList(ctx:Context,args:string){
        let newArgs=JSON.parse(args);
        let doctor=await this.getDoctor(ctx,args);
        let doctorJson=JSON.parse(doctor);
        let patientList=JSON.parse(doctorJson.patientList);
        if(patientList.includes(newArgs.patientId))return true;
        else{
          patientList.push(newArgs.patientId);
          doctorJson.patientList=JSON.stringify(patientList);
          await ctx.stub.putState(doctorJson.doctorId, Buffer.from(JSON.stringify(doctorJson)));
          return true;
        }
        
    }

    @Transaction()
    public async createPatient(ctx:Context,args:string):Promise<Boolean>{
        let newArgs=JSON.parse(args);
        let newPatient=new Patient(newArgs.patientId,newArgs.firstName,newArgs.lastName,newArgs.emailId,newArgs.doctorId,newArgs.password,newArgs.ehrList);
        await ctx.stub.putState(newPatient.patientId, Buffer.from(JSON.stringify(newPatient)));
        return true;
    }

    @Transaction()
    public async createRoomForChat(ctx:Context,args:string):Promise<Boolean>{
        let newArgs=JSON.parse(args);
        let indexName="doctor~patient";
        let doctorPatientKey=ctx.stub.createCompositeKey(indexName,[newArgs.doctorId,newArgs.patientId]);
        await ctx.stub.putState(doctorPatientKey,Buffer.from(newArgs.roomId));
        return true;
    }
  





    



    // rich text queries for presence of Id
    
    @Transaction(false)
    public async queryWithQueryString(ctx:Context, queryString:string) {

        console.log('query String');
        console.log(JSON.stringify(queryString));
    
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
    
        let allResults = [];
    
        // eslint-disable-next-line no-constant-condition
        while (true) {
          let res = await resultsIterator.next();
    
          if (res.value && res.value.value.toString()) {
            let jsonRes = {Key:"",Record:{}};
    
            console.log(res.value.value.toString('utf8'));
    
            jsonRes.Key = res.value.key;
    
            try {
              jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
              console.log(err);
              jsonRes.Record = res.value.value.toString('utf8');
            }
    
            allResults.push(jsonRes);
          }
          if (res.done) {
            console.log('end of data');
            await resultsIterator.close();
            console.info(allResults);
            console.log(JSON.stringify(allResults));
            return JSON.stringify(allResults);
          }
        }
      }

    @Transaction(false)
    public async queryByObjectType(ctx:Context, objectType:string) {

        let queryString = {
          selector: {
            type: objectType
          }
        };
    
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    
      }

    @Transaction(false)
    public async queryByEhr(ctx:Context, ehrID:string) {

        let queryString = {
          selector: {
            ehrID: ehrID
          }
        };
    
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    
      }

      @Transaction(false)
      public async queryByPatientID(ctx:Context, args:string) {
          let newObj=JSON.parse(args);


          let patientId=newObj.patientId;

          let patientExists=await this.patientExists(ctx,args);
          if(!patientExists)throw new Error('patient does not exist')
          
          let queryString = {
            selector: {
              patientId: patientId
            }
          };
      
          let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
          return queryResults;
      
        }


        @Transaction(false)
        public async queryAllEhrOfPatient(ctx:Context, args:string) {

          let patientExists=await this.patientExists(ctx,args);
          if(!patientExists)throw new Error('patient does not exist')
      
          let patient=await this.getPatient(ctx,args);
          let patientJson=JSON.parse(patient);
          let ehrList=JSON.parse(patientJson.ehrList);
          let allEhrs=[];
          for(let i of ehrList){
            let ehr=await this.readEhr(ctx,i);
            allEhrs.push(ehr);
          }

          return allEhrs;
        }



        // get the history of a patient based on key

        @Transaction(false)
        public async getHistoryPatientID(ctx:Context, args:string) {
          let newObj=JSON.parse(args);

          let patientExists=await this.patientExists(ctx,args);
          if(!patientExists)throw new Error('patient does not exist')
      
          let queryResults = await ctx.stub.getHistoryForKey(newObj.patientId);
          let allRes=[];
          while(true){
              let res=await queryResults.next();
              if(res.value){
                let val=JSON.parse(res.value.value.toString('utf8'));
                let time=res.value.timestamp.getSeconds();
                let histObj={"doctorId":"","time":0};
                histObj.doctorId=val.doctorId;
                histObj.time=time;
                allRes.push(histObj);
              }

              if(res.done){
                return allRes;
              }
              
          }
        }

        @Transaction(false)
        public async getRoomForChat(ctx:Context, args:string) {
          let newObj=JSON.parse(args);
          let indexName="doctor~patient";
          let doctorPatientKey=ctx.stub.createCompositeKey(indexName,[newObj.doctorId,newObj.patientId]);
          let patientExists=await this.patientExists(ctx,args);
          if(!patientExists)throw new Error('patient does not exist')
          
          let buffer=await ctx.stub.getState(doctorPatientKey);
          return buffer.toString();
        }


}