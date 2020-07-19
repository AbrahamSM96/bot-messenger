'use strict';

const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');

const access_token =
  'EAAK6EDe7zvEBABSLDkWFadEG4q3lXZCZCAOn65O9bemT5hee33ZBoR6cd13lOHqcrPrH9zrJYUxk53NZCnR0WFppvIGFrjHtrA7FYhqakv8SoG1r6m1FmF2vAoN3e9ItBJ9GJtxWMF1vQZC95q0emcBy5cKbEMefZC0ZBxJ2ZCnEXRwgM3sHpZB427jOxCYDjAZB0ZD';

const app = express();

app.set('port', 5000);
app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.send('Hola mundo');
});

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === 'centralbrownies_token') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Central Brownies no tienes permisos.');
  }
});

app.post('/webhook/', (req, res) => {
  const webhook_event = req.body.entry[0];
  if (webhook_event.messaging) {
    webhook_event.messaging.forEach((event) => {
      console.log(event);
      handleEvent(event.sender.id, event);
    });
  }
  res.sendStatus(200);
});

function handleEvent(senderId, event) {
  if (event.message) {
    handleMessage(senderId, event.message);
  } else if (event.postback) {
    handlePostback(senderId, event.postback.payload);
  }
}

function handleMessage(senderId, event) {
  if (event.text) {
    defaultMessage(senderId);
  } else if (event.attachments) {
    handleAttachments(senderId, event);
  }
}

function defaultMessage(senderId) {
  const messageData = {
    recipient: {
      id: senderId,
    },
    messaging_type: 'RESPONSE',
    message: {
      text: 'Hola soy el bot de Central Brownies y te invito a ver nuestro menú',
    },
  };
  senderActions(senderId);
  callSendApi(messageData);
}

// capturando los postback
function handlePostback(senderId, payload) {
  console.log(payload);
  switch (payload) {
    case 'GET_STARTED_CENTRALBROWNIES':
      senderActions(senderId);
      defaultMessage(senderId);
      showBrownies(senderId);
      break;
    case 'BROWNIES_PAYLOAD':
      senderActions(senderId);
      showBrownies(senderId);
      break;
    case 'PIZZA_PAYLOAD':
      senderActions(senderId);
      listPizzas(senderId);
      contactSupport(senderId);

      break;
    case 'CAJAS_PAYLOAD':
      senderActions(senderId);
      listCajas(senderId);
      contactSupport(senderId);
      break;
    case 'PCHEESECAKE_PAYLOAD':
      senderActions(senderId);
      listPcheesecake(senderId);
      contactSupport(senderId);

      break;
    case 'CORABROWNIE_PAYLOAD':
      senderActions(senderId);
      listCorabrownie(senderId);
      contactSupport(senderId);

      break;
    case 'CUPCAKES_PAYLOAD':
      senderActions(senderId);
      listCupcakes(senderId);
      contactSupport(senderId);

      break;
    case 'CARLOTAS_PAYLOAD':
      senderActions(senderId);
      listCarlotas(senderId);
      contactSupport(senderId);

      break;
    case 'WHATSAPP_PAYLOAD':
      senderActions(senderId);
      contactSupport(senderId);
      break;
    default:
      defaultMessage(senderId);
      break;
  }
}

function senderActions(senderId) {
  const messageData = {
    recipient: {
      id: senderId,
    },
    sender_action: 'typing_on',
  };
  callSendApi(messageData);
}

// function handleMessage(event) {
//   const senderId = event.sender.id;
//   const messageText = event.message.text;
//   const messageData = {
//     recipient: {
//       id: senderId,
//     },
//     message: {
//       text: messageText,
//     },
//   };
//   callSendApi(messageData);
// }

function handleAttachments(senderId, event) {
  let attachment_type = event.attachments[0].type;
  switch (attachment_type) {
    case 'image':
      console.log(attachment_type);
      break;

    case 'video':
      console.log(attachment_type);
      break;
  }
}

function callSendApi(response) {
  request(
    {
      uri: 'https://graph.facebook.com/me/messages',
      qs: {
        access_token: access_token,
      },
      method: 'POST',
      json: response,
    },
    function (err) {
      if (err) {
        console.log('Ha ocurrido un error', err);
      } else {
        console.log('Mensaje Enviado');
      }
    }
  );
}

function showBrownies(senderId) {
  const messageData = {
    recipient: {
      id: senderId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Pizza brownie',
              subtitle: 'Pizza brownie de 20cm o 25cm',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/pizzabrownie25cm.jpg?alt=media&token=6c1c611b-22d1-4624-baf2-1e1b2a9c9a53',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir pizzas',
                  payload: 'PIZZA_PAYLOAD',
                },
              ],
            },
            {
              title: 'Caja brownies',
              subtitle: 'Caja de 4, 6 Y 9 brownies con toppings',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/caja6.jpg?alt=media&token=e670d8eb-9985-4ada-9cdf-aec4e1e11719',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir cajas',
                  payload: 'CAJAS_PAYLOAD',
                },
              ],
            },
            {
              title: 'Pizza brownie de cheesecake',
              subtitle: 'Pizza con cubierta de chessecake de 20cm y 25cm',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/cheesecake20cm.jpg?alt=media&token=8b262e42-e0e8-46a0-b857-cfd0e2ae660a',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir cheesecake',
                  payload: 'PCHEESECAKE_PAYLOAD',
                },
              ],
            },
            {
              title: 'Corabrownie ',
              subtitle: 'Corabrownie de 20cm Y 25cm',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/cora20cm.jpg?alt=media&token=7441b65e-36f2-44bb-a46e-3ba28449b13d',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir corabrownie',
                  payload: 'CORABROWNIE_PAYLOAD',
                },
              ],
            },

            {
              title: 'Cupcakes',
              subtitle: 'Cupcakes 4 y 6 piezas',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/cupcakes.jpg?alt=media&token=8e117a60-72d6-4c0f-94cf-b3491d04d3e9',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir cupcakes',
                  payload: 'CUPCAKES_PAYLOAD',
                },
              ],
            },
            {
              title: 'Carlotas',
              subtitle: 'Carlotas de limon o mango',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/carlotamango.jpg?alt=media&token=9ed265a0-351b-430a-99c3-73b14cc2617d',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir carlotas',
                  payload: 'CARLOTAS_PAYLOAD',
                },
              ],
            },
            {
              title: 'Ver menú',
              subtitle: 'Da click para poder ver los precios del menú',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/menu-new.png?alt=media&token=1f6fce20-e572-4049-9dbe-2efa5521b9fa',
              default_action: {
                type: 'web_url',
                url:
                  'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/menu-new.png?alt=media&token=1f6fce20-e572-4049-9dbe-2efa5521b9fa',
              },
            },
            {
              title: 'Ver menú mini brownies',
              subtitle: 'Da click para poder ver los precios de los mini brownies',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/minibrow-menu.png?alt=media&token=d352ba81-8005-4cac-89e1-dfd2e88cf768',
              default_action: {
                type: 'web_url',
                url:
                  'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/minibrow-menu.png?alt=media&token=d352ba81-8005-4cac-89e1-dfd2e88cf768',
              },
            },
            {
              title: 'Toppings',
              subtitle: 'Da click para poder ver los toppings disponibles',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/toppings.png?alt=media&token=8acbe954-f5e3-4daf-9e0e-51566c7a8d59',
              default_action: {
                type: 'web_url',
                url:
                  'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/toppings.png?alt=media&token=8acbe954-f5e3-4daf-9e0e-51566c7a8d59',
              },
            },
          ],
        },
      },
    },
  };
  callSendApi(messageData);
}

function listPizzas(senderId) {
  const messageData = {
    recipient: {
      id: senderId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Pizza brownie de 20cm',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/pizza20cm.jpg?alt=media&token=584cc5cc-2238-45c8-8ad6-21da17cd0053',
              subtitle: 'Pizza brownie que contiene 4 rebanadas \n $170',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'PIZZA20_PAYLOAD',
                },
              ],
            },
            {
              title: 'Pizza brownie de 25cm',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/pizzabrownie25cm.jpg?alt=media&token=6c1c611b-22d1-4624-baf2-1e1b2a9c9a53',
              subtitle: 'Pizza brownie que contiene 8 rebanadas \n $230',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'PIZZA25_PAYLOAD',
                },
              ],
            },
          ],
        },
      },
    },
  };
  callSendApi(messageData);
}

function listCajas(senderId) {
  const messageData = {
    recipient: {
      id: senderId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Caja de 9 brownies',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/caja9.jpg?alt=media&token=1a54c0e6-7106-45a5-8c1b-947e323ae21c',
              subtitle: 'Caja de 9 brownies con toppings \n $190',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'CAJA9_PAYLOAD',
                },
              ],
            },
            {
              title: 'Caja de 6 brownies',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/caja6.jpg?alt=media&token=e670d8eb-9985-4ada-9cdf-aec4e1e11719',
              subtitle: 'Caja de 6 brownies con toppings \n $150',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'CAJA6_PAYLOAD',
                },
              ],
            },
            {
              title: 'Caja de 4 brownies',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/caja4.jpg?alt=media&token=16a43858-695a-4045-9847-b911499484c6',
              subtitle: 'Caja de 4 brownies con toppings \n $120',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'CAJA4_PAYLOAD',
                },
              ],
            },
          ],
        },
      },
    },
  };
  callSendApi(messageData);
}

function listPcheesecake(senderId) {
  const messageData = {
    recipient: {
      id: senderId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Pizza brownie de cheesecake 20cm',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/cheesecake20cm.jpg?alt=media&token=8b262e42-e0e8-46a0-b857-cfd0e2ae660a',
              subtitle: 'Pizza brownie que contiene 4 rebanadas con topping de Oreo \n $140',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'PCHEESECAKE20_PAYLOAD',
                },
              ],
            },
            {
              title: 'Pizza brownie de cheesecake 25cm',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/cheesecake25cm.jpg?alt=media&token=a5443d49-67d2-4f9e-a6d3-a69a3359729b',
              subtitle: 'Pizza brownie de cheesecake que contiene 8 rebanadas con topping de Oreo \n $190',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'PCHEESECAKE25_PAYLOAD',
                },
              ],
            },
          ],
        },
      },
    },
  };
  callSendApi(messageData);
}

function listCorabrownie(senderId) {
  const messageData = {
    recipient: {
      id: senderId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Corabrownie 20cm',
              subtitle: 'Corabrownie de 20cm y 6 rebanadas con toppings \n $190',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/cora20cm.jpg?alt=media&token=7441b65e-36f2-44bb-a46e-3ba28449b13d',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'CORA20_PAYLOAD',
                },
              ],
            },
            {
              title: 'Corabrownie 25cm',
              subtitle: 'Corabrownie de 25cm y 8 rebanadas con toppings \n $250',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/cora25cm.jpg?alt=media&token=b376dac9-0cb3-4d6f-9209-df7c73cda8ed',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'CORA25_PAYLOAD',
                },
              ],
            },
          ],
        },
      },
    },
  };
  callSendApi(messageData);
}

function listCupcakes(senderId) {
  const messageData = {
    recipient: {
      id: senderId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Cupcakes',
              subtitle: 'Cupcakes 4 piezas \n $100',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/cupcakes.jpg?alt=media&token=8e117a60-72d6-4c0f-94cf-b3491d04d3e9',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'CUPCAKES4_PAYLOAD',
                },
              ],
            },
            {
              title: 'Cupcakes',
              subtitle: 'Cupcakes 6 piezas \n $140',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/cupcakes.jpg?alt=media&token=8e117a60-72d6-4c0f-94cf-b3491d04d3e9',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'CUPCAKES6_PAYLOAD',
                },
              ],
            },
          ],
        },
      },
    },
  };
  callSendApi(messageData);
}

function listCarlotas(senderId) {
  const messageData = {
    recipient: {
      id: senderId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Carlota de limón',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/carlotalimon.jpg?alt=media&token=4028a6b1-f818-4a9d-93cc-32c91971846e',
              subtitle: 'Carlota de limon para 8 u 10 personas \n $140',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'CLIMON_PAYLOAD',
                },
              ],
            },
            {
              title: 'Carlota de mango',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/centralbrownies-b8c31.appspot.com/o/carlotamango.jpg?alt=media&token=9ed265a0-351b-430a-99c3-73b14cc2617d',
              subtitle: 'Carlota de mango para 8 u 10 personas \n $160',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir',
                  payload: 'CMANGO_PAYLOAD',
                },
              ],
            },
          ],
        },
      },
    },
  };
  callSendApi(messageData);
}

function contactSupport(senderId) {
  const messageData = {
    recipient: {
      id: senderId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text:
            'Hola!!, ¿Listo para ordenar?, hazlo mediante WhatsApp o indícanos que gustarías ordenar, que toppings quisieras, si es envío a domicilio o entrega en nuestros puntos de entrega gratuitos y para cuando seria ',
          buttons: [
            {
              type: 'web_url',
              title: 'WhatsApp',
              url: 'https://bit.ly/CentralBrowniesWhatsApp',
            },
          ],
        },
      },
    },
  };
  callSendApi(messageData);
}

function getLocation(senderId) {
  const messageData = {
    recipient: {
      id: senderId,
    },
    message: {
      text: 'Ahora ¿Puedes proporcionarnos tu ubicacion para calcular el envío?',
      quick_replies: [
        {
          content_type: 'location',
        },
      ],
    },
  };
  callSendApi(messageData);
}

app.listen(app.get('port'), () => {
  console.log('Nuestro servidor esta funcionando en el puerto', app.get('port'));
});
