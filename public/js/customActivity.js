const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/enviar-sms', async (req, res) => {
  const { toPhone, message } = req.body;

  try {
    // Obtener el token de autenticación
    const tokenResponse = await axios.post('https://api.bg.com.bo/bgdev/api-oauth/oauth2/token', {
      client_id: 'bga-app-api-crm-01',
      client_secret: '8DrLhkRINhafvUtw1Kf83aLuTIWE1eEa',
      grant_type: 'client_credentials'
    });

    const accessToken = tokenResponse.data.access_token;

    // Construir el objeto JSON con los datos del mensaje
    const smsData = {
      data: {
        toPhone: toPhone,
        message: message,
        typeMessage: 3,
        idRequestor: 10000,
        funcionalityId: 30
      },
      metadata: {
        codUsuario: 'JBK',
        codSucursal: 70,
        codAplicacion: 1
      }
    };

    // Enviar la solicitud a la API para enviar el SMS
    await axios.post('https://api.bg.com.bo/bgdev/int/notifc/v1/sms/send', smsData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.send('SMS enviado correctamente');
  } catch (error) {
    console.error('Error al enviar el SMS:', error);
    res.status(500).send('Error al enviar el SMS');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
