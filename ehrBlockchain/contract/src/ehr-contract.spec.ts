// /*
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import { Context } from 'fabric-contract-api';
// import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
// import { EhrContract } from '.';

// import * as chai from 'chai';
// import * as chaiAsPromised from 'chai-as-promised';
// import * as sinon from 'sinon';
// import * as sinonChai from 'sinon-chai';
// import winston = require('winston');

// chai.should();
// chai.use(chaiAsPromised);
// chai.use(sinonChai);

// class TestContext implements Context {
//     public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
//     public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
//     public logging = {
//         getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
//         setLevel: sinon.stub(),
//      };
// }

// describe('EhrContract', () => {

//     let contract: EhrContract;
//     let ctx: TestContext;

//     beforeEach(() => {
//         contract = new EhrContract();
//         ctx = new TestContext();
//         ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"ehr 1001 value"}'));
//         ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"ehr 1002 value"}'));
//     });

//     describe('#ehrExists', () => {

//         it('should return true for a ehr', async () => {
//             await contract.ehrExists(ctx, '1001').should.eventually.be.true;
//         });

//         it('should return false for a ehr that does not exist', async () => {
//             await contract.ehrExists(ctx, '1003').should.eventually.be.false;
//         });

//     });

//     describe('#createEhr', () => {

//         it('should create a ehr', async () => {
//             await contract.createEhr(ctx, '1003', 'ehr 1003 value');
//             ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"ehr 1003 value"}'));
//         });

//         it('should throw an error for a ehr that already exists', async () => {
//             await contract.createEhr(ctx, '1001', 'myvalue').should.be.rejectedWith(/The ehr 1001 already exists/);
//         });

//     });

//     describe('#readEhr', () => {

//         it('should return a ehr', async () => {
//             await contract.readEhr(ctx, '1001').should.eventually.deep.equal({ value: 'ehr 1001 value' });
//         });

//         it('should throw an error for a ehr that does not exist', async () => {
//             await contract.readEhr(ctx, '1003').should.be.rejectedWith(/The ehr 1003 does not exist/);
//         });

//     });

//     describe('#updateEhr', () => {

//         it('should update a ehr', async () => {
//             await contract.updateEhr(ctx, '1001', 'ehr 1001 new value');
//             ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"ehr 1001 new value"}'));
//         });

//         it('should throw an error for a ehr that does not exist', async () => {
//             await contract.updateEhr(ctx, '1003', 'ehr 1003 new value').should.be.rejectedWith(/The ehr 1003 does not exist/);
//         });

//     });

//     describe('#deleteEhr', () => {

//         it('should delete a ehr', async () => {
//             await contract.deleteEhr(ctx, '1001');
//             ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
//         });

//         it('should throw an error for a ehr that does not exist', async () => {
//             await contract.deleteEhr(ctx, '1003').should.be.rejectedWith(/The ehr 1003 does not exist/);
//         });

//     });

// });
