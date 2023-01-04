//Import Hyperledger Fabric 1.4 programming model - fabric-network
'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');

//connect to the config file
const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
// let userName = config.userName;
let gatewayDiscovery = config.gatewayDiscovery;
let appAdmin = config.appAdmin;
let orgMSPID = config.orgMSPID;

// connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);


const util = require('util');

exports.connectToNetwork = async function (userName) {
  
  const gateway = new Gateway();

  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    const userExists = await wallet.exists(userName);

    if (!userExists) {
      console.log('An identity for the user ' + userName + ' does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      let response = {};
      response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
      return response;
    }


    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

    // Connect to our local fabric
    const network = await gateway.getNetwork('mychannel');

    console.log('Connected to mychannel. ');
    // Get the contract we have installed on the peer
    const contract = await network.getContract('finalProj');


    let networkObj = {
      contract: contract,
      network: network,
      gateway: gateway
    };
    return networkObj;

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    let response = {};
    response.error = error;
    return response;
  }
};

exports.patientExists=async (username)=>{

  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    const userExists = await wallet.exists(username);

    if (!userExists) {
      console.log('An identity for the user ' + username + ' does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      return false;
    }
    else {return true;}

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    let response = {};
    response.error = error;
    return response;
  }
}

exports.invoke = async function (networkObj, isQuery, func, args) {
  try {
    
    if (isQuery === true) {

      if (args) {
        args=JSON.stringify(args[0]);
        let response = await networkObj.contract.evaluateTransaction(func, args);
        await networkObj.gateway.disconnect();
        return response;
    } 
      else {

        let response = await networkObj.contract.evaluateTransaction(func);
        await networkObj.gateway.disconnect();
        return response;
      }
    } else {

      if (args) {
        args=JSON.stringify(args[0]);
        let response = await networkObj.contract.submitTransaction(func, args);
        await networkObj.gateway.disconnect();
        return response;
      } 
      else {
        let response = await networkObj.contract.submitTransaction(func);
        await networkObj.gateway.disconnect();
        return response;
      }
    }

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return error;
  }
};

exports.registerDoctor = async function (doctorID, firstName, lastName,password) {

  if (!doctorID || !firstName || !lastName) {
    let response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    console.log(wallet);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(doctorID);
    if (userExists) {
      let response = {};
      console.log(`An identity for the user ${doctorID} already exists in the wallet`);
      response.error = `Error! An identity for the user ${doctorID} already exists in the wallet. Please enter
        a different license number.`;
      return response;
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists(appAdmin);
    if (!adminExists) {
      console.log(`An identity for the admin user ${appAdmin} does not exist in the wallet`);
      console.log('Run the enrollAdmin.js application before retrying');
      let response = {};
      response.error = `An identity for the admin user ${appAdmin} does not exist in the wallet. 
        Run the enrollAdmin.js application before retrying`;
      return response;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: appAdmin, discovery: gatewayDiscovery });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();
    console.log(`AdminIdentity: + ${adminIdentity}`);

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({ affiliation: 'org1', enrollmentID: doctorID, role: 'client' }, adminIdentity);

    const enrollment = await ca.enroll({ enrollmentID: doctorID, enrollmentSecret: secret });
    const userIdentity = await X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
    await wallet.import(doctorID, userIdentity);
    console.log(`Successfully registered voter ${firstName} ${lastName}. Use doctorID ${doctorID} to login above.`);
    let response = `Successfully registered voter ${firstName} ${lastName}. Use doctorID ${doctorID} to login above.`;
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${doctorID} + : ${error}`);
    let response = {};
    response.error = error;
    return response;
  }
};

exports.registerPatient = async function (patientID, firstName, lastName) {
  if (!patientID || !firstName || !lastName) {
    let response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    console.log(wallet);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(patientID);
    if (userExists) {
      let response = {};
      console.log(`An identity for the user ${patientID} already exists in the wallet`);
      response.error = `Error! An identity for the user ${patientID} already exists in the wallet. Please enter
        a different license number.`;
      return response;
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists(appAdmin);
    if (!adminExists) {
      console.log(`An identity for the admin user ${appAdmin} does not exist in the wallet`);
      console.log('Run the enrollAdmin.js application before retrying');
      let response = {};
      response.error = `An identity for the admin user ${appAdmin} does not exist in the wallet. 
        Run the enrollAdmin.js application before retrying`;
      return response;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: appAdmin, discovery: gatewayDiscovery });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();
    console.log(`AdminIdentity: + ${adminIdentity}`);

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({ affiliation: 'org1', enrollmentID: patientID, role: 'client' }, adminIdentity);

    const enrollment = await ca.enroll({ enrollmentID: patientID, enrollmentSecret: secret });
    const userIdentity = await X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
    await wallet.import(patientID, userIdentity);
    console.log(`Successfully registered voter ${firstName} ${lastName}. Use patientID ${patientID} to login above.`);
    let response = `Successfully registered voter ${firstName} ${lastName}. Use patientID ${patientID} to login above.`;
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${patientID} + : ${error}`);
    let response = {};
    response.error = error;
    return response;
  }
  };