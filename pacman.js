$(document).ready(function() {

});

/** ready document above and edit store to correct questions */

const STORE = {
    questions: [
      {
        question: 'Which of the following is NOT a name of one of the Pac-Man Ghosts?',
      answers: [
        'Pinky',
        'Stinky',
        'Blinky',
        'Clyde'
      ],
      correctAnswer: 'Stinky'
      },
      {
        question: 'What year was Pac-Man introduced to America?',
      answers: [
        '1970',
        '1980',
        '1972',
        '1984'
      ],
      correctAnswer: '1980'
      },
      {
        question: 'How many points are earned when you collect a special Cherry Fruit Object?',
      answers: [
        '10',
        '100',
        '200',
        '500'
      ],
      correctAnswer: '100'
      },
      {
        question: 'What food was allegedly the inspiration for the Pac-Man design?',
      answers: [
        'Tacos',
        'Gumballs',
        'Lemons',
        'Pizza'
      ],
      correctAnswer: 'Pizza'
      },
      {
        question: 'Which of the following colors in NOT a color of one of the Pac-Man Ghost?',
      answers: [
        'Green',
        'Red',
        'Pink',
        'Blue'
      ],
      correctAnswer: 'Green'
      }
    ],
    quizStarted: false,
    currentQuestion: 0,
    score: 0
  };

  /** function to generate the start/home page with a start button */

function genStartPage() {
    return `
      <div>
        <button type="button" id="start">Start Test</button>
      </div>
    `;
  }
  
  /** function to generate score trackers - both question number and score */
  function genScoreTrackers() {
    return `
      <ul class="scoreTracker">
        <li id="question-number">
          Question Number: ${STORE.currentQuestion + 1}/${STORE.questions.length}
        </li>
        <li id="score">
          Score: ${STORE.score}/${STORE.questions.length}
        </li>
      </ul>
    `;
  }

  /* function to generate question form
  answers will be created next
  2 buttons at bottom - submit and next */
  function genQuestionForm() {
    let currentQuestion = STORE.questions[STORE.currentQuestion];
    return `
      <form id="question-form" class="question-form">
        <fieldset>
          <div class="question">
            <legend> ${currentQuestion.question}</legend>
          </div>
          <div id="hrId"><hr></div>
          <div class="options">
            <div class="answers">
              ${genAnswers()}
            </div>
          </div>
          <div class="buttonBox">
            <button type="submit" id="submitButton" tabindex="5">Submit</button>
            <button type="button" id="nextButton" tabindex="6"> Next </button>
          </div>
        </fieldset>
      </form >
    `;
  }

  /** called in function above - generates list of answer choices for correct question */
  function genAnswers() {
    const answersArray = STORE.questions[STORE.currentQuestion].answers
    let answersHtml = '';
    let i = 0;
  
    answersArray.forEach(answer => {
      answersHtml += `
        <div id="option-container-${i}">
          <input type="radio" name="options" id="option${i + 1}" value= "${answer}" tabindex ="${i + 1}" required> 
          <label for="option${i + 1}"> ${answer}</label>
        </div>
      `;
      i++;
    });
    return answersHtml;
  }

    /** generate short feedback message based off of result of choice
     * display message for either correct or incorrect
    */
  function genQuickResult(answerResult) {
    let correctAnswer = STORE.questions[STORE.currentQuestion].correctAnswer;
    let html = '';
    if (answerResult === 'correct') {
      html = `
      <div class="correctChoice">Correct! Nice job!</div>
      `;
    }
    else if (answerResult === 'incorrect') {
      html = `
        <div class="incorrectChoice">Incorrect! The right answer is ${correctAnswer}.</div>
      `;
    }
    return html;
  }

  /** generate finalScore form with results and restart button*/
  function genFinalPage() {
    return `
      <div class="results">
        <form id="js-restart-quiz">
          <fieldset>
            <div>
              <div class="finalBoxes">
                <legend id="finalScore">Your Score is: ${STORE.score}/${STORE.questions.length}</legend>
              </div>
            </div>
          
            <div>
              <div class="finalBoxes">
                <button type="button" id="restartButton"> Restart Quiz </button>
              </div>
            </div>
          </fieldset>
      </form>
      </div>
    `;
  }
  

  
  /****** RENDER *******/
  
  /** render */
  function render() {
    let html = '';
  
    if (STORE.quizStarted === false) {
      $('main').html(genStartPage());
      return;
    }
    else if (STORE.currentQuestion >= 0 && STORE.currentQuestion < STORE.questions.length) {
      html = genScoreTrackers();
      html += genQuestionForm();
      $('main').html(html);
    }
    else {
      $('main').html(genFinalPage());
    }
  }
  
  /******* EVENT HANDLERS ******/
  
  /**handles clicking the start button*/
  function handleStartButton() {
    $('main').on('click', '#start', function (event) {
      STORE.quizStarted = true;
      render();
    });
  }
  

   /**handles clicking the submission button
    * get vaulue of selected option and determine if correct or incorrect
    * show and hide buttons
   */
  function handleFormSubmission() {
    $('body').on('submit', '#question-form', function (event) {
      event.preventDefault();
      const currentQuestion = STORE.questions[STORE.currentQuestion];
  
      let selectedOption = $('input[name=options]:checked').val();
    
      let optionContainerId =
       `#option-container-${currentQuestion.answers.findIndex(i => i === selectedOption)}`;
  
      if (selectedOption === currentQuestion.correctAnswer) {
        STORE.score++;
        $(optionContainerId).append(genQuickResult('correct'));
      }
      else {
        $(optionContainerId).append(genQuickResult('incorrect'));
      }
      STORE.currentQuestion++;

      $('#submitButton').hide();

      $('input[type=radio]').each(() => {
        $('input[type=radio]').attr('disabled', true);
      });

      $('#nextButton').show();
  
    });
  }

  /**handles clicking the next button*/
  function handleNextButton() {
    $('body').on('click', '#nextButton', (event) => {
      render();
    });
  }
  
  /**
   * Resets everything
   */
  function restartTest() {
    STORE.quizStarted = false;
    STORE.currentQuestion = 0;
    STORE.score = 0;
  }
  
   /**handles clicking the restart button*/
  function handleRestartButton() {
    $('body').on('click', '#restartButton', () => {
      restartTest();
      render();
    });
  }
  
   /**handles pactest app functions*/
  function handlePacTestApp() {
    render();
    handleStartButton();
    handleNextButton();
    handleFormSubmission();
    handleRestartButton();
  }
  /**call final function*/ 

  $(handlePacTestApp);