  // Initialize Firebase
var config = {
  apiKey: "AIzaSyCaJgPEhPMjStLfcg5goNcENjUIsjmbg2w",
  authDomain: "can-junior-beat-angel.firebaseapp.com",
  databaseURL: "https://can-junior-beat-angel.firebaseio.com",
  storageBucket: "can-junior-beat-angel.appspot.com",
  messagingSenderId: "850788034375"
};

firebase.initializeApp(config);
var database = firebase.database();

var winsRef = database.ref('/wins');

winsRef.on('value',function(snapshot){
  var wins = snapshot.val();
  populateWins(wins);
});

function populateWins(wins){
  Object.keys(wins).map(function(key){
    document.getElementById(key).innerHTML=wins[key];
  });
}

function submitWinner(winner){
  checkPin().then(function(passwordCorrect){
    if(passwordCorrect){
      firebase.auth().signInAnonymously().then(function(){
        var updates = {};
        updates['/wins/'+winner] = ++document.getElementById(winner).innerHTML;
        database.ref().update(updates);
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('error:',errorCode,errorMessage);
      });
    } else {
      alert('bad pin');
    }
  });
}

function checkPin(){
  var pass = document.getElementById('pin').value;
  return database.ref('/pin').once('value').then(function(pin){
    return pin.val()==pass;
  });
}