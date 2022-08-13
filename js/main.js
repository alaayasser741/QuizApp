let _question = document.getElementById("questions");
let _options = document.querySelector(".options");
let _correctScore = document.getElementById("correct-score");
let _totalQuestion = document.getElementById("total-question");
let _result = document.getElementById("result");
let _checkBtn = document.getElementById("check");
let _againBtn = document.getElementById("again");
let _countDown = document.querySelector(".countdown");
let _category = document.getElementById("category");
let _difficulty = document.getElementById("difficulty");
let _wrapper = document.querySelector(".wrapper");
let _start = document.querySelector(".start");
let btnStart = document.getElementById("start");
let _answerGroup = document.querySelector(".AnswerGroup");
let _correctAnswer = document.querySelector(".correctAnswer");
let _container = document.querySelector(".container");

// let text = _category.options[_category.selectedIndex].text;
// let value = _category.options[_category.selectedIndex].value;

// /////////////////////////////////////////
// Function to display selected value on screen
function getSelectedOption(_category) {
  var opt;
  for (var i = 0, len = _category.options.length; i < len; i++) {
    opt = _category.options[i];
    if (opt.selected === true) {
      break;
    }
  }
  return opt;
}
function getSelectedOption(_difficulty) {
  var opt;
  for (var i = 0, len = _difficulty.options.length; i < len; i++) {
    opt = _difficulty.options[i];
    if (opt.selected === true) {
      break;
    }
  }
  return opt;
}
let cat = ``;
let diff = ``;
// /////////////////////////////////////////////
let groupOfAnswer = [];
let correctAnswer = "",
  correcrScore = (askedCount = 0),
  totalQuestion = 10,
  questcount = 0;

let url = `https://opentdb.com/api.php?amount=10`;
btnStart.onclick = (event) => {
  alert('If You Close Full Screen Quiz Will End !')
  event.preventDefault();
  var elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }

  
  var opt = getSelectedOption(_category);
  var optt = getSelectedOption(_difficulty);
  if (opt.value === "any") {
    cat = ``;
  } else {
    cat = `&category=${opt.value}`;
  }
  if (optt.value === "any") {
    diff = ``;
  } else {
    diff = `&difficulty=${optt.value}`;
  }
  _start.style.display = "none";
  _wrapper.style.display = "unset";
  url = `https://opentdb.com/api.php?amount=10${cat}${diff}`;
  loadQuist();
  eventListener();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = questcount;
  countDown(120, totalQuestion);
  groupOfAnswer = [];
};
async function loadQuist() {
  // var opt = getSelectedOption(_category);
  // var optt = getSelectedOption(_difficulty);
  // cat = `&category=${opt.value}`;
  // diff = `&difficulty=${optt.value}`;
  const result = await fetch(`${url}`);
  const data = await result.json();
  _result.innerHTML = "";
  showQuestion(data.results[0]);
}
function eventListener() {
  _checkBtn.addEventListener("click", checkAnswer);
  _againBtn.addEventListener("click", restartQuiz);
}

// document.addEventListener("DOMContentLoaded", function () {

// });
function showQuestion(data) {
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionslist = incorrectAnswer;
  optionslist.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );
  _question.innerHTML = `${data.question}<br><span class="category">${data.category}</span>`;
  _options.innerHTML = `${optionslist
    .map((option, index) => `<li>${index + 1}.<span> ${option} </span></li>`)
    .join("")}`;
  selectOption();
}
function selectOption() {
  _options.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      if (_options.querySelector(".selected")) {
        const activeOption = _options.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
}

function checkAnswer() {
  _checkBtn.disabled = true;
  if (_options.querySelector(".selected")) {
    let selectedAnswer = _options.querySelector(".selected span").textContent;
    if (selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
      correcrScore++;
      _result.innerHTML = `<p><i class="fa-solid fa-circle-check"></i>Correct Answer!</p>`;
    } else {
      _result.innerHTML = `<p><i class="fa-solid fa-circle-xmark"></i>Wrong Answer!</p>`;
    }
    checkCount();
  } else {
    _result.innerHTML = `<p><i class="fa-solid fa-circle-question"></i>Please select an option!</p>`;
    _checkBtn.disabled = false;
  }
  groupOfAnswer.push(correctAnswer);
}
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}
function checkCount() {
  questcount++;
  askedCount++;
  setCount();
  if (askedCount == totalQuestion) {
    _result.innerHTML = `<p>Your Score is ${correcrScore}.</p>`;
    _againBtn.style.display = "block";
    _checkBtn.style.display = "none";
  } else {
    setTimeout(() => {
      loadQuist();
    }, 1000);
  }
  // countDown(20,totalQuestion);
}
function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = questcount;
}

function countDown(duration, count) {
  if (questcount < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      _countDown.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        _result.innerHTML = `<p>Time finshed Your Score : ${correcrScore}.</p>`;
        _againBtn.style.display = "block";
        _checkBtn.style.display = "none";
      } else if (questcount === count) {
        clearInterval(countDownInterval);
        _container.style.display = "none";
        _correctAnswer.style.display = "block";
        _answerGroup.innerHTML = `${groupOfAnswer
          .map((option, index) => `<li> ${option}</li>`)
          .join("")}`;
      }
      if (
        window.fullScreen ||
        (window.innerWidth == screen.width && window.innerHeight == screen.height)
      ) {
      } else {
        clearInterval(countDownInterval);
        _result.innerHTML = `<p>You Close Full Screen Quiz Ended!<br> Your Score : ${correcrScore}.</p>`;
        _container.style.display = "none";
        _againBtn.style.display = "block";
        _checkBtn.style.display = "none";
      }
    }, 1000);
  }
}
function restartQuiz() {
  var elem = document.documentElement;
  if (elem.exitFullscreen) {
    elem.exitFullscreen();
  } else if (elem.webkitExitFullscreen) { /* Safari */
  elem.webkitExitFullscreen();
  } else if (elem.msExitFullscreen) { /* IE11 */
  elem.msExitFullscreen();
  }
  correcrScore = askedCount = questcount = 0;
  _start.style.display = "unset";
  _wrapper.style.display = "none";
  _againBtn.style.display = "none";
  _checkBtn.style.display = "block";
  _container.style.display = "block";
  _correctAnswer.style.display = "none";
  _checkBtn.disabled = false;
  setCount();
  loadQuist();
}
