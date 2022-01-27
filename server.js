const express = require('express');
const bodyParser = require('body-parser');
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


//Verificador de conexion hacia el servidor
app.get('/', function(req, res) {
    res.json('JARVIS UPS esta en Línea');
})

//Prueba de conexion al puerto
app.listen(3000, () => {
    console.log('Escuchando puerto:', 3000);
});


//Consumo de la API de IBM Watson
const assistantId = 'c81a57d9-727a-4988-bc03-5e57c5ec0bdc';
const assistant = new AssistantV2({
    version: '2020-02-05',
    authenticator: new IamAuthenticator({
        apikey: 'NrzcCJ8QW-cdApuj2Ls2njXl5O1bh2rDpHyoDBZp8ql6',
    }),
    url: 'https://api.us-east.assistant.watson.cloud.ibm.com/instances/59f14005-14e5-4c73-a1ff-51f66dc1a24f',
    disableSslVerification: true,
});


//Genera una conversacion 
app.post('/conversation', (req, res) => {
    let { text, sessionId } = req.body;
    const params = {
        input: {
            message_type: 'text',
            text: text
        },
        assistantId,
        sessionId: sessionId
    };

    assistant.message(params, (err, response) => {
        if (err) {
            console.error(err);
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                response
            });
        }
    });
});

//Abre una nueva sesion
app.post('/abrirsesion', (req, res) => {

    const params = {
        assistantId
    };

    assistant.createSession(params, (err, response) => {
        if (err) {
            console.error(err);
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                response
            });
        }
    });
});


//cerrar sesion
app.post('/cerrarsesion', (req, res) => {
    const { sessionId } = req.body;
    const params = {
        assistantId,
        sessionId: sessionId
    };

    assistant.deleteSession(params, (err, response) => {
        if (err) {
            console.error(err);
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                response
            });
        }
    });
});

//===================
// Exports
//===================
module.exports = app;