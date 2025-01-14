const startButton = document.getElementById('start-button');
const output = document.getElementById('output');

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var commands = ["a1", "a2", "a3", "a4", "b1", "b2", "b3", "b4", "c1", "c2", "c3", "c4", "d1", "d2", "d3", "d4"]

var recognition = new SpeechRecognition();
if (SpeechGrammarList) {
    var speechRecognitionList = new SpeechGrammarList();var speechRecognitionList = new SpeechGrammarList();
    var grammar = '#JSGF V1.0; grammar commands; public <commands> = ' + commands.join(' | ') + ' ;'
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
  }
  recognition.continuous = false;
  recognition.lang = 'pl-PL';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function(event) {
    var command = event.results[0][0].transcript;
    console.log(command);
    console.log('Confidence: ' + event.results[0][0].confidence);
}

startButton.onclick = function() {
    recognition.start();
    console.log('Ready to receive a command.');
}