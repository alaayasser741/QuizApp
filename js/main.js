let _question = document.getElementById("questions");
let _options = document.querySelector(".options");
let _correctScore = document.getElementById("correct-score");
let _totalQuestion = document.getElementById("total-question");
let _result = document.getElementById("result");
let _checkBtn = document.getElementById("check");
let _againBtn = document.getElementById("again");

let correctAnswer = "",
  correcrScore = (askedCount = 0),
  totalQuestion = 20,
  questcount = 0;

async function loadQuist() {
  const url = "https://opentdb.com/api.php?amount=20&category=21";
  const result = await fetch(`${url}`);
  const data = await result.json();
  _result.innerHTML = "";
  showQuestion(data.results[0]);
}
function eventListener() {
  _checkBtn.addEventListener("click", checkAnswer);
  _againBtn.addEventListener("click", restartQuiz);
}

document.addEventListener("DOMContentLoaded", function () {
  loadQuist();
  eventListener();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = questcount;
});
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
  console.log(correctAnswer);
}

function checkAnswer() {
  _checkBtn.disabled = true;
  if (_options.querySelector(".selected")) {
    let selectedAnswer = _options.querySelector(".selected span").textContent;
    if (selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
      correcrScore++;
      _result.innerHTML = `<p><i class="fa-solid fa-circle-check"></i>Correct Answer!</p>`;
    } else {
      _result.innerHTML = `<p><i class="fa-solid fa-circle-xmark"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
    }
    checkCount();
  } else {
    _result.innerHTML = `<p><i class="fa-solid fa-circle-question"></i>Please select an option!</p>`;
    _checkBtn.disabled = false;
  }
}
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}
function checkCount() {
  questcount++;
  console.log(questcount)
  askedCount++;
  setCount();
  if (askedCount == totalQuestion) {
    _result.innerHTML += `<p>Your Score is ${correcrScore}.</p>`;
    _againBtn.style.display = "block";
    _checkBtn.style.display = "none";
  } else {
    setTimeout(() => {
      loadQuist();
    }, 300);
  }
}
function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = questcount;
}
function restartQuiz() {
  correcrScore = askedCount = 0;
  _againBtn.style.display = "none";
  _checkBtn.style.display = "block";
  _checkBtn.disabled = false;
  setCount();
  loadQuist();
}
