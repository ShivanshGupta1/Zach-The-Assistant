const btn = document.querySelector("button");
const outputme = document.querySelector(".output-you");
const outputbot = document.querySelector(".output-bot");
const myAudio = document.getElementById("myAudio");
var msg;
var askName;
var askWeather;
var personName = "";
var cityName;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;
btn.addEventListener("click", () => {
  myAudio.volume = 1.0;
  myAudio.play();
  recognition.start();

  if (askName == true) {
    recognition.onresult = function (event) {
      var res = event.results.length - 1;
      personName = event.results[res][0].transcript;
      outputme.textContent = personName;
      msg = new SpeechSynthesisUtterance(
        "It is wonderful to meet you, " + personName
      );
      msg.lang = "en-US";
      outputbot.textContent = "It is wonderful to meet you, " + personName;
      window.speechSynthesis.speak(msg);
      recognition.stop();
    };
    askName = false;
  } else if (askWeather == true) {
    recognition.onresult = function (event) {
      var res = event.results.length - 1;
      cityName = event.results[res][0].transcript;
      outputme.textContent = cityName;
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=c6c30d38cf009bf578bec2302aa23248`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          var fullRes =
            "The weather in " +
            cityName +
            " is " +
            data.weather[0].description +
            " and, the temperature is " +
            data.main.temp +
            ". Finally, the pressure is " +
            data.main.pressure;
          msg = new SpeechSynthesisUtterance(fullRes);
          msg.lang = "en-US";
          outputbot.textContent = fullRes;
          window.speechSynthesis.speak(msg);
          recognition.stop();
        });
    };

    askWeather = false;
  } else {
    start();
  }
});

function start() {
  recognition.onresult = function (event) {
    const last = event.results.length - 1;
    var text = event.results[last][0].transcript;
    console.log(text);
    outputme.textContent = text;
    text = text.toLowerCase();

    if (text.includes("hello")) {
      outputbot.textContent = "Hello there!";
      msg = new SpeechSynthesisUtterance("Hello there!");
    } else if (text.includes("name")) {
      outputbot.textContent =
        "Hi! My name is Zach and I am your Personal Assistant! Could you please tell me your name? Please click again!";
      msg = new SpeechSynthesisUtterance(
        "Hi! My name is Zack and I am your Personal Assistant! Could you please tell me your name?"
      );

      askName = true;
      recognition.stop();
    } else if (text.includes("date") || text.includes("date today")) {
      var dateToday = new Date();
      dateToday =
        dateToday.getDate() +
        "/" +
        dateToday.getMonth() +
        "/" +
        dateToday.getFullYear();
      outputbot.textContent =
        personNameChecker() + " The date today is " + dateToday;
      msg = new SpeechSynthesisUtterance(
        personNameChecker() + " The date today is " + dateToday
      );
    } else if (text.includes("weather") || text.includes("weather today")) {
      outputbot.textContent =
        "Could you perhaps tell me the city you are looking for?" +
        personNameChecker();
      msg = new SpeechSynthesisUtterance(
        "Could you perhaps tell me the city you are looking for?" +
          personNameChecker()
      );
      askWeather = true;
      recognition.stop();
    } else if (
      text.includes("thanks") ||
      text.includes("thank you") ||
      text.includes("thanks you!")
    ) {
      outputbot.textContent =
        "No problem" + personNameChecker() + ". It is my job to help you!.";

      msg = new SpeechSynthesisUtterance(
        "No problem" + personNameChecker() + ". It is my job to help you!."
      );
    } else if (
      text.includes("goodbye") ||
      text.includes("terminate") ||
      text.includes("delete")
    ) {
      outputbot.textContent =
        "Thank you " +
        personNameChecker() +
        " for using me! It was a great time talking to you! Terminating Bot!";

      msg = new SpeechSynthesisUtterance(
        "Thank you " +
          personNameChecker() +
          " for using me! It was a great time talking to you! Terminating Bot!"
      );

      var countdown = 3;

      setInterval(() => {
        outputbot.textContent = countdown;
        countdown -= 1;
        if (countdown < 0) {
          console.log("hello");
          window.close();
        }
      }, 2000);
    } else {
      outputbot.textContent = "Sorry, I could not understand you!";
      msg = new SpeechSynthesisUtterance("Sorry, I could not understand you!");
    }
    msg.lang = "en-US";
    window.speechSynthesis.speak(msg);
  };
}
function personNameChecker() {
  if (personName != "") {
    return personName;
  } else {
    return "";
  }
}
