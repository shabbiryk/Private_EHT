# Private-EHR
 
A hyperledger fabric blockchain application that is mainly concerened with the management of Electronic Health Records (EHR) in a private permissioned blockchain.
 
## Prerequisites
 
Ubuntu OS 16.04 <br />
VSCode- version 1.39 <br />
npm- version 6.x <br />
node- version 10.x.x <br />
angular- version 9.1.7 <br />
docker - version 19.3.8 <br />
docker-compose 1.24.1 <br />
docker extension- version 0.82 <br />
IBM Blockchain Platform- version 1.0.28
 
## How to run
 
### Starting the Client Server
 
1. `cd client`
2. `npm install`
3. `ng serve`
 
### Starting the Primary NodeJs Server
 
1. `cd server`
2. `npm install`
3. `node src/app.js`
 
### Starting the Blockchain Server
 
1. Open the Contract folder with VSCode.
 
2. Go to blockchain platform and select package open project as shown in the figure below:
 
![homepage](/screenshots/pkg_open_proj.png)
 
 
3. Now close this VSCode.  Go back to the main folder and open this folder in VSCode.
 
4. Now again go to the blockchain extension. Export the wallet `Org1` as shown in the figure below by placing it in the server folder and rename it to `wallet`. 
 
![homepage](/screenshots/exp_wallet.png)
 
5. You will notice the presence of packaged project from the previous step. Now connect to the environment by clicking on `1 Org Local Fabric`.  On a successful connection, the VSCode editor will prompt you a message.
 
6.  On a successful connection, you will get various options in the environment pane on the left.  Here install the package as shown in the figure below:
 
![homepage](/screenshots/install_pkg.png)
 
7. Now instantiate the installed package in the same pane by following the figure:
 
![homepage](/screenshots/instantiate_pkg.png)
 
 
8. Access the homepage of our application by going to `https://localhost:4200/homepage`.  This completes the run procedure of our system. This system can now be used by the user. 
 
## Vision of the Product
 
To create a *consortium* of worldwide healthcare institutions to record and manipulate the EHRs using our Dapp. We focus over the fact that to handle the medical activities in a more efficient and time saving manner, we need to create an ease of access of medical records for the patients and doctors. Later with the evolution of blockchain technologies, we can also create a network of networks to easily manage the data for any patient-doctor consultation. 
 
## Reason for building the Product
 
1. The medical industry has evolved in a format in which the medical institutions monopolize over the patient's data. We are keen to change this.
 
2. If you google about EHRs in the blockchain you might get a number of papers and research work done in the area but very few applications that have actually been implemented with the chaincode in action. We want to be amongst the first individuals to create such a permissioned ledger.
 
3. Maintaining health records turns into a huge mess when the volume increases a mere 10 to 15 papers. With an electronic health record management system, we remove the tangible nature of such records and hence dematerialise them.
 
4. Using the Hyperledger fabric, we can easily maintain the historical records for any user referenced by their userID. This is a great help when it comes to accessing previous records and prevents tampering of the data by any sorts.
 
## Uniqueness of the Product
 
The *USP* of our application model is that we are giving the patients complete control over their data. Using a unique system of generating `One Time Password` (OTP) for every **patient-doctor consultations** we are restricting unwanted data retrieval and access. OTPs provide a trustable method of reconciling to the fact that the patient and doctor are in contact whenever a manipulation to the EHR is made. A doctor cant just changes that on his own.
 
There are very few applications which are actually built for maintaining the EHRs in a blockchain. On top of that, we are also providing a fully-featured angular application that integrated very easily with our backend.
 
As of now, we are providing cardiology related diagnosis parameters in the application. It is expected that as future work we will build over this and extend it to contain most of the medical diagnosis domains.
 
## Building the Platform
 
1. ***Frontend** - Angular
2. **Backend** - NodeJS
3. **Blockchain** - Hyperledger fabric
4. **Development** - IBM blockchain platform VSCode extension.
 

 

