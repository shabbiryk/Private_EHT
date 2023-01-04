'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const {
    v4
} = require('uuid')

const app = express();

let network = require('./fabric/network.js');


// session related variable
const jwtKey = "secret_key"
const jwtExpirySeconds = 3000

// middleware for body parser and cors
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());


// mail related variables
const fromMail = 'shbryk@gmail.com';
const subject = 'Otp for login';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shbryk@gmail.com',
        pass: 'privateehr123'
    }
});


// middleware for sessioning

app.set('trust proxy', 1)

// configuration related variables
const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);





//use this identity to query
const appAdmin = config.appAdmin;


// database related variables
const otpModel = require("./models/otp");
mongoose.connect('mongodb+srv://m001-student:mBVI3SbOLiX22EPT@avinash-001-q92dl.mongodb.net/blockchain?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(res => console.log('connected'))
    .catch(e => console.log(e));


// method to generate Token
function generateToken(entityId) {
    let token = jwt.sign({
        entityId
    }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    });
    return String(token);
}



// handlers for creating user i.e doctor/patient


app.post('/createDoctor', async (req, res) => {
    let args = req.body;
    let doctorId = req.body.doctorId;
    args = JSON.parse(JSON.stringify(args));

    let response = await network.registerDoctor(doctorId, args.firstName, args.lastName, args.password);
    if (response.error) {
        res.send({
            action: false,
            message: "error in doctor registration"
        });
    } else {
        let networkObj = await network.connectToNetwork(doctorId);
        if (networkObj.error) {
            res.send({
                action: false,
                message: "error in connecting to network"
            });
        }

        let invokeResponse = await network.invoke(networkObj, false, 'createDoctor', [args]);
        if (invokeResponse.error) {
            res.send({
                action: false,
                message: "error in invoking chaincode"
            });
        } else {
            if (invokeResponse.toString() == "false") {
                res.send({
                    action: false,
                    message: "doctor already exists"
                });
            } else {
                let token = generateToken(doctorId);
                res.send({
                    action: true,
                    message: "succesfully created doctor",
                    token: token
                });
            }
        }
    }
});

app.post('/createPatient', async (req, res) => {

    let doctorId = req.body.doctorId;
    let args = req.body;
    let patientId = req.body.patientId;
    args = JSON.parse(JSON.stringify(args));

    let response = await network.registerPatient(patientId, args.firstName, args.lastName);
    if (response.error) {
        res.send({
            action: false,
            message: "error in patient registration"
        });
    } else {

        let networkObj = await network.connectToNetwork(doctorId);
        if (networkObj.error) {
            res.send({
                action: false,
                message: "error in connecting to network"
            });
        }

        let invokeResponse = await network.invoke(networkObj, false, 'createPatient', [args]);
        if (invokeResponse.error) {
            res.send({
                action: false,
                message: "error in invoking chaincode"
            });

        } else {
            if (invokeResponse.toString() == "false") {
                res.send({
                    action: false,
                    message: "patient already exists"
                });
            } else {
                res.send({
                    action: true,
                    message: "succesfully created patient"
                })
            }
        }
    }
});



app.post('/createEhr', async (req, res) => {
    let patientId = req.body.patientId;
    let doctorId = req.body.doctorId;
    let args = req.body;
    let ehrId = v4()
    args = JSON.parse(JSON.stringify(args));
    args.ehrId = ehrId;
    let networkObj = await network.connectToNetwork(doctorId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find doctor"
        })
    };


    let invokeResponse = await network.invoke(networkObj, false, 'createEhr', [args]);
    if (invokeResponse.error) {
        res.send({
            action: false,
            message: "error in invoking chaincode"
        });

    } else {
        if (invokeResponse.toString() == "true")
            res.send({
                action: true,
                message: "succesfully created ehr"
            })
        else {
            res.send({
                action: false,
                message: "some error occured"
            })
        }
    }
});

app.post('/getRoomForChat', async (req, res) => {
        let doctorId=req.body.doctorId;
        let patientId=req.body.patientId;
        let args={"patientId":patientId,"doctorId":doctorId};
        args = JSON.parse(JSON.stringify(args));
        let networkObj = await network.connectToNetwork(doctorId);
        if (networkObj.error) {
            res.send({
                action: false,
                message: "could not find doctor"
            })
        };
        let invokeResponse = await network.invoke(networkObj,true, 'getRoomForChat', [args]);
        if (invokeResponse.error) {
            res.send({
                action: false,
                message: "error in invoking"
            })
        } else {
            if (invokeResponse.toString() == ""){
                res.send({
                    action: false,
                    message: "no room found"
                })
            }
            else {
                res.send({
                    action: true,
                    message: invokeResponse.toString()
                })
            }
        }
});

app.post('/createRoomForChat', async (req, res) => {
        let doctorId=req.body.doctorId;
        let patientId=req.body.patientId;
        let args={"patientId":patientId,"doctorId":doctorId,"roomId":""};
        let roomId = v4();
        args.roomId = roomId;
        args = JSON.parse(JSON.stringify(args));
        let networkObj = await network.connectToNetwork(doctorId);
        if (networkObj.error) {
            socket.emit('error',{action:false,message:"network obj error"})
        };
        let invokeResponse = await network.invoke(networkObj,false,'createRoomForChat',[args]);
        if (invokeResponse.error) {
            res.send({
                action: false,
                message: "error in invoking chaincode"
            })
        } else {
            if (invokeResponse.toString() == "true"){
                res.send({
                    action: true,
                    message: roomId
                })
            }
            else {
                res.send({
                    action: false,
                    message: "error in creating room"
                })
            }
        }
});


// handlers to check presence of user


app.post('/checkDoctor', async (req, res) => {
    let args = req.body;
    args = JSON.parse(JSON.stringify(args));


    let networkObj = await network.connectToNetwork(args.doctorId);

    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find doctor"
        })
    } else {
        let doctorExist = await network.invoke(networkObj, true, 'checkDoctorPassword', [args]);
        if (doctorExist.error) {
            res.send({
                action: false,
                message: "wrong credentials"
            });
        }

        if (doctorExist.toString() == "false") {
            res.send({
                action: false,
                message: "wrong credentials"
            });
        } else if (doctorExist.toString() == "true") {
            let token = generateToken(args.doctorId);
            res.send({
                action: true,
                message: "successfully fetched doctor",
                token: token
            });
        } else {
            res.send({
                action: false,
                message: "error due to unknown reasons"
            })
        }
    }

});

app.post('/checkPatient', async (req, res) => {
    let args = req.body;
    args = JSON.parse(JSON.stringify(args));

    let networkObj = await network.connectToNetwork(args.patientId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find patient"
        })
    };
    let patientExist = await network.invoke(networkObj, true, 'patientExists', [args]);
    if (patientExist.error) {
        res.send({
            action: false,
            message: "wrong credentials"
        });
    }
    if (patientExist.toString() == "false") {
        res.send({
            action: false,
            message: "patient is not registered in blockchain"
        });
    } else if (patientExist.toString() == "true") {
        res.send({
            action: true,
            message: "successfully fetched patient"
        });
    } else {
        res.send({
            action: false,
            message: "error due to unknown reasons"
        })
    }
});




// handlers to change the doctor patient relationships

app.post('/updateDoctorForPatient', async (req, res) => {
    let doctorId = req.body.doctorId;
    let args = JSON.parse(JSON.stringify(req.body));
    let networkObj = await network.connectToNetwork(doctorId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find doctor"
        })
    };

    let invokeResponse = await network.invoke(networkObj,false, 'updateDoctorForPatient', [args]);
    if (invokeResponse.error) {
        res.send({
            action: false,
            message: "error in updating patient"
        });
    } else {
        if (invokeResponse.toString() != "true") {
            res.send({
                action: false,
                message: "some error occured"
            });
        } else {
            res.send({
                action: true,
                message: "successfully updated Patient"
            });
        }
    }

})

app.post('/addPatientToDoctorList', async (req, res) => {
    let doctorId = req.body.doctorId;
    let args = JSON.parse(JSON.stringify(req.body));
    console.log(args)
    let networkObj = await network.connectToNetwork(doctorId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find doctor"
        })
    };

    let invokeResponse = await network.invoke(networkObj, false, 'addPatientToDoctorList', [args]);
    if (invokeResponse.error) {
        res.send({
            action: false,
            message: "error in updating doctor list"
        });
    } else {
        if (invokeResponse.toString() != "true") {
            res.send({
                action: false,
                message: "some error occured"
            });
        } else {
            res.send({
                action: true,
                message: "successfully updated doctor list"
            });
        }
    }

});




app.post('/getPatientDoctorHistory', async (req, res) => {
    let patientId = req.body.patientId;
    let networkObj = await network.connectToNetwork(patientId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find patient"
        })
    };


    let args = JSON.parse(JSON.stringify(req.body));
    let invokeResponse = await network.invoke(networkObj, true, 'getHistoryPatientID', [args]);
    if (invokeResponse.error) {
        res.send({
            action: false,
            message: "could not invoke chaincode"
        })
    } else {
        res.send({
            action: true,
            message: invokeResponse.toString()
        })

    }
});



// utility handlers

app.post('/checkUsernamePresence', async (req, res) => {
    let args = req.body;
    args = JSON.parse(JSON.stringify(args));

    let networkObj = await network.connectToNetwork(args.id);
    if (!networkObj.error) {
        res.send({
            action: false,
            message: "username not available"
        })
    } else {
        console.log('here');
        let userExist = await network.invoke(networkObj, true, 'checkUsernamePresence', [args]);
        
        if (!userExist) {
            res.send({
                action: true,
                message: "username available"
            });
        }
        if (userExist.doctorId || userExist.patientId) {
            res.send({
                action: false,
                message: "username already used"
            });
        } else {
            res.send({
                action: true,
                message: "username available"
            });
        }
    }

});


app.post('/checkPatientPassword', async (req, res) => {
    let patientId = req.body.patientId;
    let args = JSON.parse(JSON.stringify(req.body));
    let networkObj = await network.connectToNetwork(patientId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find doctor"
        })
    };

    let patientExist = await network.invoke(networkObj, true, 'checkPatientPassword', [args]);
    if (patientExist.error) {
        res.send({
            action: false,
            message: "wrong credentials"
        });
    }

    if (patientExist.toString() == "false") {
        res.send({
            action: false,
            message: "password entered is wrong"
        });
    } else if (patientExist.toString() == "true") {
        res.send({
            action: true,
            message: "successfully fetched password",
            token: generateToken(patientId)
        });
    } else {
        res.send({
            action: false,
            message: "error due to unknown reasons"
        })
    }

})

// handler to generate otp for old patient login

app.post('/sendOtpToPatient', async (req, res) => {
    let patientId = req.body.patientId;
    let args = req.body;
    let doctorId = req.body.doctorId;
    args = JSON.parse(JSON.stringify(args));
    let networkObj = await network.connectToNetwork(doctorId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find doctor"
        })
    };
    let patientM = await network.invoke(networkObj, true, 'getMailIdOfPatient', [args]);
    if (patientM.error) {
        res.send({
            action: false,
            message: "patient not found. Please register"
        });
    } else {
        if (patientM.toString().includes("Error")) {
            res.send({
                action: false,
                message: "some error occured"
            });
        } else {
            let patientMail = patientM.toString();
            let otp = Math.floor(Math.random() * 100000);
            let mailOptions = {
                from: fromMail,
                to: patientMail,
                subject: subject,
                text: `The otp for the present session is ${otp}`
            };

            otpModel.findOne({
                patientId
            }).then(resp1 => {
                if (!resp1) {
                    let otpJson = new otpModel({
                        patientId,
                        otp
                    });
                    otpJson.save().then(() => {
                        transporter.sendMail(mailOptions, (error, response) => {
                            if (error) {
                                res.send({
                                    action: false,
                                    message: "error occured in sending mail " + error
                                })
                            }
                            res.send({
                                action: true,
                                message: "mail sent successfully"
                            })
                        });
                    }).catch(e => {
                        res.send({
                            action: false,
                            message: "error occured in sending mail " + e
                        })
                    })
                } else {
                    resp1.otp = otp;
                    otpModel.findOneAndUpdate({
                        patientId
                    }, resp1).then(() => {
                        transporter.sendMail(mailOptions, (error, response) => {
                            if (error) {
                                res.send({
                                    action: false,
                                    message: "error occured in sending mail " + error
                                })
                            }
                            res.send({
                                action: true,
                                message: "mail sent successfully"
                            })
                        });
                    }).catch(e => {
                        res.send({
                            action: false,
                            message: "error occured in sending mail " + e
                        })
                    })
                }
            })

        }
    }

});

// handler to generate otp for patient logini

app.post('/generateOtp', async (req, res) => {


    let patientId = req.body.patientId;
    let args = req.body;

    let networkObj = await network.connectToNetwork(patientId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find patient"
        })
    };
    let patientM = await network.invoke(networkObj, true, 'getMailIdOfPatient', [args]);
    if (!patientM.toString()) {
        res.send({
            action: false,
            message: "some error occured"
        });
    } else {
        let patientMail = patientM.toString();
        let otp = Math.floor(Math.random() * 100000);
        let mailOptions = {
            from: fromMail,
            to: patientMail,
            subject: subject,
            text: `The otp for the present session is ${otp}`
        };

        otpModel.findOne({
            patientId
        }).then(resp1 => {
            if (!resp1) {
                let otpJson = new otpModel({
                    patientId,
                    otp
                });
                otpJson.save().then(() => {
                    transporter.sendMail(mailOptions, (error, response) => {
                        if (error) {
                            res.send({
                                action: false,
                                message: "error occured in sending mail " + error
                            })
                        }else{
                            res.send({
                                action: true,
                                message: "mail sent successfully"
                            })
                        }
                        
                    });
                }).catch(e => {
                    res.send({
                        action: false,
                        message: "error occured in sending mail " + e
                    })
                })
            } else {
                resp1.otp = otp;
                otpModel.findOneAndUpdate({
                    patientId
                }, resp1).then(() => {
                    transporter.sendMail(mailOptions, (error, response) => {
                        if (error) {
                            res.send({
                                action: false,
                                message: "error occured in sending mail " + error
                            })
                        }
                        else{
                            res.send({
                                action: true,
                                message: "mail sent successfully"
                            })
                        }
                        
                    });
                }).catch(e => {
                    res.send({
                        action: false,
                        message: "error occured in sending mail " + e
                    })
                })
            }
        })

    }
});


// handler to check otp

app.post('/checkOtp', (req, res) => {
    let patientId = req.body.patientId;
    let otp = req.body.otp;
    otpModel.findOne({
        patientId
    }).then(resp1 => {
        if (resp1.otp === otp) {
            res.send({
                action: true,
                message: "correct otp provided",
                token: generateToken(patientId)
            });
        } else {
            res.send({
                action: false,
                message: "incorrect otp provided",
                token: "token_absent"
            })
        }
    })
})

// handler to know if the patient has already set password

app.post('/patientHasPassword', async (req, res) => {
    let patientId = req.body.patientId;
    let args = JSON.parse(JSON.stringify(req.body));
    let networkObj = await network.connectToNetwork(patientId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find patient"
        })
    };

    let patientExist = await network.invoke(networkObj, true, 'patientHasPassword', [args]);

    if (patientExist.toString() == "false") {
        res.send({
            action: false,
            message: "no password set"
        });
    } else if (patientExist.toString() == "true") {
        res.send({
            action: true,
            message: "successfully set password"
        });
    } else {
        res.send({
            action: false,
            message: "error due to unknown reasons"
        })
    }

});

// handler to check the patient password for login

app.post('/setPatientPassword', async (req, res) => {
    let patientId = req.body.patientId;
    let args = JSON.parse(JSON.stringify(req.body));

    let networkObj = await network.connectToNetwork(patientId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find patient"
        })
    };
    let patientExist = await network.invoke(networkObj, false, 'setPatientPassword', [args]);

    if (patientExist.toString() == "false") {
        res.send({
            action: false,
            message: "password entered is wrong"
        });
    } else if (patientExist.toString() == "true") {
        res.send({
            action: true,
            message: "successfully set password"
        });
    } else {
        res.send({
            action: false,
            message: "error due to unknown reasons"
        })
    }

})



// handler to get the entire ledger of ehrs for patient based on requester


app.post("/getHistoryForPatient", async (req, res) => {
    let patientId = req.body.patientId;
    let doctorId = req.body.doctorId;
    let networkObj = await network.connectToNetwork(doctorId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find doctor"
        })
    };


    let args = JSON.parse(JSON.stringify(req.body));
    let invokeResponse = await network.invoke(networkObj, true, 'queryAllEhrOfPatient', [args]);
    if (invokeResponse.error) {
        res.send({
            action: false,
            message: "could not invoke chaincode"
        })
    } else {
        let ehrs = invokeResponse.toString();
            let ehrList = JSON.parse(ehrs);
            let uniqueList=[...new Set(ehrList)]
        res.send({
            action: true,
            message: uniqueList
        })

    }
});


app.post("/getHistoryForPatientByPatient", async (req, res) => {
    let patientId = req.body.patientId;
    let networkObj = await network.connectToNetwork(patientId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find patient"
        })
    };


    let args = JSON.parse(JSON.stringify(req.body));
    let invokeResponse = await network.invoke(networkObj, true, 'queryAllEhrOfPatient', [args]);
    if (invokeResponse.error) {
        res.send({
            action: false,
            message: "could not invoke chaincode"
        })
    } else {
        let ehrs = invokeResponse.toString();
            let ehrList = JSON.parse(ehrs);
            let uniqueList=[...new Set(ehrList)]
        res.send({
            action: true,
            message:uniqueList
        })

    }
})

// handlet to get all the patients aligned with the doctor

app.post('/getPatientsForDoctor', async (req, res) => {
    let doctorId = req.body.doctorId;
    let networkObj = await network.connectToNetwork(doctorId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find doctor"
        })
    } else {

        let args = JSON.parse(JSON.stringify(req.body));
        let invokeResponse = await network.invoke(networkObj, true, 'getDoctor', [args]);
        if (invokeResponse.error) {
            res.send({
                action: false,
                message: "could not invoke chaincode"
            })
        } else {
            let doctor = invokeResponse.toString();
            let doctorJson = JSON.parse(doctor);
            let list=JSON.parse(doctorJson.patientList);
            let uniqueList=[...new Set(list)]
            
            res.send({
                action: true,
                message: JSON.stringify(uniqueList)
            })

        }
    }
});

// handler to get the details of the doctor

app.post('/getDoctor', async (req, res) => {
    let doctorId = req.body.doctorId;
    let networkObj = await network.connectToNetwork(doctorId);
    if (networkObj.error) {
        res.send({
            action: false,
            message: "could not find doctor"
        })
    } else {

        let args = JSON.parse(JSON.stringify(req.body));
        let invokeResponse = await network.invoke(networkObj, true, 'getDoctor', [args]);
        if (invokeResponse.error) {
            res.send({
                action: false,
                message: "could not invoke chaincode"
            })
        } else {
            let doctor = invokeResponse.toString();
            
            res.send({
                action: true,
                message: doctor
            })

        }
    }
});


app.listen(8000, () => {
    console.log('listening at port 8000');
});
