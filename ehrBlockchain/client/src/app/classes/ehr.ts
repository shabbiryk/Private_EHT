import { Utils } from './utils';
import { Symptoms } from './symptoms';
import { BloodTest } from './blood-test';

export class Ehr {

    constructor(
        public doctorId:String,
        public patientId:String,
        public ehrId:String,
        public Symptoms:Symptoms,
        public anyOtherProblem:String,
        public bloodtest:BloodTest,
        public medicines:String,
        public util:Utils,
        public reviewOfDoctor:String
    ){}
    
}
