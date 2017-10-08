 const Clarifai = require('clarifai');

// const app = new Clarifai.App({
//   apiKey: 'badb2651d2b446028293a78bee03475b'
//  });
 
// app.models.predict('faces', 'http://oayomide.com.ng/wp-content/uploads/2017/09/2017-03-24-181642_2.jpg').then(
//   function(response)
//    {
//   //   for (let i = 0; i < response.rawData.outputs[0].data.concepts.length; i++) {
//      console.log(response.rawData.outputs[0].data.concepts[0].name);
//   //   }
//   },
//   function(err) {
//     console.error(err);
//   }
// );const Clarifai = require('clarifai');

// const app = new Clarifai.App({
//   apiKey: 'badb2651d2b446028293a78bee03475b'
//  });
 
// app.models.predict('faces', 'http://oayomide.com.ng/wp-content/uploads/2017/09/2017-03-24-181642_2.jpg').then(
//   function(response)
//     {
//   //   for (let i = 0; i < response.rawData.outputs[0].data.concepts.length; i++) {
//      console.log(response.rawData.outputs[0].data.concepts[0].name);
//   //   }
//   },
//   function(err) {
//     console.error(err);
//   }
// );
// const app = new Clarifai.App({
//     apiKey: 'badb2651d2b446028293a78bee03475b'
//    });
   
//    // add inputs with concepts
//    app.inputs.create([{
//      "url": "http://oayomide.com.ng/wp-content/uploads/2017/09/2017-07-22-175839.jpg",
//      "concepts": [
//        { "id": "ayo", "value": true },
//        { "id": "unknown", "value": false }
//      ]
//    }, {
//      "url": "http://oayomide.com.ng/wp-content/uploads/2017/09/2017-05-25-160938.jpg",
//      "concepts": [
//        { "id": "ayo", "value": true },
//        { "id": "unknown", "value": false }
//      ]
//    }, {
//      "url": "http://oayomide.com.ng/wp-content/uploads/2017/09/2017-05-25-160816.jpg",
//      "concepts": [
//        { "id": "ayo", "value": true },
//        { "id": "unknown", "value": false }
//      ]
//    }, {
//      "url": "http://oayomide.com.ng/wp-content/uploads/2017/09/2017-04-24-181608.jpg",
//      "concepts": [
//        { "id": "ayo", "value": true },
//        { "id": "unknown", "value": false }
//      ]
//    }]).then(
//      createModel,
//      errorHandler
//    );
   
//    // once inputs are created, create model by giving name and list of concepts
//    function createModel(inputs) {
//      app.models.create('facestwo', ["unknown", "ayom"]).then(
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
   
//   //  after training the model, you can now use it to predict on other inputs
//    function predictModel(model) {
//      model.predict(['http://oayomide.com.ng/wp-content/uploads/2017/09/2017-04-24-181608.jpg']).then(
//        function(response) {
//          console.log(response);
//        }, errorHandler
//      );
//    }
   
//    function errorHandler(err) {
//      console.error(err);
//    }

const app = new Clarifai.App({
  apiKey: 'badb2651d2b446028293a78bee03475b'
 });
 
 // add inputs with concepts
 app.inputs.create([{
   "url": "https://samples.clarifai.com/dog1.jpeg",
   "concepts": [
     { "id": "cat", "value": false },
     { "id": "dog", "value": true }
   ]
 }, {
   "url": "https://samples.clarifai.com/dog2.jpeg",
   "concepts": [
     { "id": "cat", "value": false },
     { "id": "dog", "value": true }
   ]
 }, {
   "url": "https://samples.clarifai.com/cat1.jpeg",
   "concepts": [
     { "id": "cat", "value": true },
     { "id": "dog", "value": false }
   ]
 }, {
   "url": "https://samples.clarifai.com/cat2.jpeg",
   "concepts": [
     { "id": "cat", "value": true },
     { "id": "dog", "value": false }
   ]
 }]).then(
   createModel,
   errorHandler
 );
 
 // once inputs are created, create model by giving name and list of concepts
 function createModel(inputs) {
   app.models.create('pet_two', ["dog", "cat"]).then(
     trainModel,
     errorHandler
   );
 }
 
 // after model is created, you can now train the model
 function trainModel(model) {
   model.train().then(
     predictModel,
     errorHandler
   );
 }
 
 // after training the model, you can now use it to predict on other inputs
 function predictModel(model) {
   model.predict(['https://samples.clarifai.com/dog3.jpeg', 'https://samples.clarifai.com/cat3.jpeg']).then(
     function(response) {
       console.log(response);
     }, errorHandler
   );
 }
 
 function errorHandler(err) {
   console.error(err);
 }