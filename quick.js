const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'badb2651d2b446028293a78bee03475b'
 });
 
app.models.predict('faces', 'http://oayomide.com.ng/wp-content/uploads/2017/09/2017-07-22-175839.jpg').then(
  function(response)
    {
  //   for (let i = 0; i < response.rawData.outputs[0].data.concepts.length; i++) {
     console.log(response.rawData.outputs[0].data.concepts[0].name);
  //   }
  },
  function(err) {
    console.error(err);
  }
);
// const app = new Clarifai.App({
//     apiKey: 'badb2651d2b446028293a78bee03475b'
//    });
   
//    // add inputs with concepts
//    app.inputs.create([{
//      "url": "http://oayomide.com.ng/wp-content/uploads/2017/09/2017-07-22-175839.jpg",
//      "concepts": [
//        { "id": "ayo", "value": false },
//        { "id": "john", "value": true }
//      ]
//    }, {
//      "url": "http://oayomide.com.ng/wp-content/uploads/2017/09/2017-05-25-160938.jpg",
//      "concepts": [
//        { "id": "ayo", "value": false },
//        { "id": "ife", "value": true }
//      ]
//    }, {
//      "url": "http://oayomide.com.ng/wp-content/uploads/2017/09/2017-05-25-160816.jpg",
//      "concepts": [
//        { "id": "ayo", "value": true },
//        { "id": "IFE", "value": false }
//      ]
//    }, {
//      "url": "http://oayomide.com.ng/wp-content/uploads/2017/09/2017-04-24-181608.jpg",
//      "concepts": [
//        { "id": "ayo", "value": true },
//        { "id": "ife", "value": false }
//      ]
//    }]).then(
//      createModel,
//      errorHandler
//    );
   
//    // once inputs are created, create model by giving name and list of concepts
//    function createModel(inputs) {
//      app.models.create('faces', ["ife", "ayo"]).then(
//        trainModel,
//        errorHandler
//      );
//    }
   
//    // after model is created, you can now train the model
//    function trainModel(model) {
//      model.train().then(
//        predictModel,
//        errorHandler
//      );
//    }
   
//    // after training the model, you can now use it to predict on other inputs
//    function predictModel(model) {
//      model.predict(['http://oayomide.com.ng/wp-content/uploads/2017/09/2017-04-24-181608.jpg']).then(
//        function(response) {
//          console.log(response);
//        }, errorHandler
//      );
//    }
   
//    function errorHandler(err) {
//      //console.error(err);
//    }