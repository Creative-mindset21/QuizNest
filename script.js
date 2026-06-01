const categoryBtn = document.querySelectorAll("#category-btn button");
const homeContainer = document.getElementById("home-container");
const questionContainer = document.getElementById("question-container");
const currentQuestion = document.getElementById("current-question");
const totalQuestions = document.getElementById("total-questions");
const questionsEl = document.getElementById("question");
const optionsList = document.querySelectorAll("#options li");
const optionContainer = document.querySelector("#options");
const nextBtn = document.getElementById("next");

let questionsArr = [];
let categoryQuestion = "";
let currentQuestionIndex = 0;
let score = 0;

/* FUNCTION TO FETCH THE  QUIZ QUESTIONS */
const fetchQuiz = async () => {
  try {
    const res = await fetch(
      `https://the-trivia-api.com/v2/questions?categories=${categoryQuestion}&types=text_choice`,
    );
    questionsArr = await res.json();
    currentQuestionIndex = 0;
    renderQuiz();
  } catch (e) {
    console.error(e);
  }
};

/* FUNCTION TO SHUFFLE ARRAYS */
function shuffle(arr) {
  let i = arr.length,
    j,
    temp;
  while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }

  return arr;
}

/* SHOW THE QUIZ QUESTIONS WHEN THE CATEGORIES ARE CLICKED */
categoryBtn.forEach((category) => {
  category.addEventListener("click", (e) => {
    categoryQuestion = e.currentTarget.dataset.category;

    homeContainer.classList.remove("active");
    questionContainer.classList.add("active");
    fetchQuiz();
  });
});

const renderQuiz = () => {
  if (!questionsArr || questionsArr.length === 0) return;

  const mainQuestion = questionsArr[currentQuestionIndex];
  console.log(mainQuestion);

  const shuffledArr = shuffle([
    mainQuestion.correctAnswer,
    ...mainQuestion.incorrectAnswers,
  ]);
  const letters = ["A", "B", "C", "D"];

  currentQuestion.innerText = currentQuestionIndex + 1;
  totalQuestions.textContent = questionsArr.length;
  questionsEl.textContent = mainQuestion.question.text;

  optionsList.forEach((option, i) => {
    option.innerHTML = `
    <span>${letters[i]}</span>
    <span>${shuffledArr[i]}</span>
    `;
  });
};

optionContainer.addEventListener("click", (e) => {
  const listEl = e.target.closest("#options li");
  if (!listEl) return;

  const correctAnswer = questionsArr[currentQuestionIndex].correctAnswer;
  console.log(correctAnswer);
  const userSelect = listEl.querySelector("span:last-child").textContent;

  optionContainer.classList.add("disable-clicks");

  /* ADD SCORE IF THE USER SELECTS THE RIGHT ANSWER AND CHOOSE THE RIGHT COLOR */
  if (userSelect === correctAnswer) {
    listEl.classList.add("correct");
    score++;
    console.log(score);
  } else {
    listEl.classList.add("incorrect");

    optionsList.forEach((o) => {
      const optText = o.querySelector("span:last-child").textContent;

      if (optText === correctAnswer) {
        o.classList.add("correct");
      }
    });
  }
});

/* FUNCTION TO SHOW THE NEXT QUESTIONS */
nextBtn.addEventListener("click", () => {
  optionsList.forEach((option) => {
    option.classList.remove("correct", "incorrect");
  });

  optionContainer.classList.remove("disable-clicks");

  if (currentQuestionIndex < questionsArr.length - 1) {
    currentQuestionIndex++;
    renderQuiz();
  } else {
    alert("Quiz finished");
  }
});
