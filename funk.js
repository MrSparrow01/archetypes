// Define global variables
var questions = [];
var blockIndex = 10;
var description = [];
var questionNumber = 1;
var usedQuestions = [];
var points = {
  "Простодушний": 0,
  "Творець": 0,
  "Правитель": 0,
  "Славний малий":0,
  "Герой":0,
  "Бунтар":0,
  "Мудрець":0,
  "Шукач":0,
  "Маг":0,
  "Коханець":0,
  "Блазень":0,
  "Дбайливий":0
};


// Load the questions from the JSON file
fetch(questionData).then(response => response.json()).then(data => {
    // Store all questions in a single array
    data.forEach(archetype => {
      archetype.questions.forEach(question => {
        questions.push({ archetype: archetype.archetype, question: question});
        description.push({ name: archetype.archetype, description: archetype.description});
      });
    });
    // Display the start block
    //displayBlock();
    //console.log(description)
    startBlock();
  });

function startBlock(){
    var questionBlock ='';
    document.querySelector('#container-1').style = "display:none";
    document.querySelector('#container-2').style = "display:none";
    document.querySelector('.container').style = "height: 100%; width: 100%";
    var startHtml = '<div class="welcome-text"><div><h1 id="headText">Тест на визначення архетипів</h1></div>';
    startHtml += '<div class="welcome"><h1 id="descriptionText">Створюйте особистий бренд, контент та оформлюйте блоги в Instagram за допомогою своїх провідних архетипів. </h1></div>';
    startHtml += '<div class="user-data">';
    startHtml += '</div>';
    startHtml += '<div><button class="startBtn" onclick=Start()>Почати тест</button></div></div>';

    questionBlock += startHtml;
    document.querySelector('.question-block').innerHTML = questionBlock;
    }

function Start(){
    document.querySelector('#container-1').style.display = "";
    document.querySelector('#container-2').style.display = "";
    document.querySelector('.next-btn').style.display = "";
    displayBlock();
}

// Function to display a block of 6 questions
function displayBlock() {
  var questionBlock = '';
  for (var i = 0; i < 6; i++) {
    // Get a random question that hasn't been used before
    var questionIndex = Math.floor(Math.random() * questions.length);
    while (usedQuestions.includes(questionIndex)) {
      questionIndex = Math.floor(Math.random() * questions.length);
    }
    usedQuestions.push(questionIndex);
    // Get the question text and archetype
    var question = questions[questionIndex];
    var questionText = question.question;
    var archetype = question.archetype;
    // Build the HTML for the question
    var questionHtml = '<div class="question">' + questionNumber +'/72. ' + questionText + '</div>';
    questionHtml += '<div class="answer"><ul>';
    questionHtml += '<li><label><input type="radio" name="answer-' + blockIndex + '-' + i + '" value="5" data-archetype="' + archetype + '">Повністю погоджуюсь</label></li>';
    questionHtml += '<li><label><input type="radio" name="answer-' + blockIndex + '-' + i + '" value="4" data-archetype="' + archetype + '">Погоджуюсь</label></li>';
    questionHtml += '<li><label><input type="radio" name="answer-' + blockIndex + '-' + i + '" value="3" data-archetype="' + archetype + '">Важко сказати</label></li>';
    questionHtml += '<li><label><input type="radio" name="answer-' + blockIndex + '-' + i + '" value="2" data-archetype="' + archetype + '">Не погоджуюсь</label></li>';
    questionHtml += '<li><label><input type="radio" name="answer-' + blockIndex + '-' + i + '" value="1" data-archetype="' + archetype + '">Повністю не погоджуюсь</label></li>';
    //questionHtml += '<li><input type="hidden" name="archetype-' + blockIndex + '-' + i + '" value="' + archetype + '">';
    questionHtml += '</ul></div>';
    // Add the question HTML to the block HTML
    questionBlock += questionHtml;
    questionNumber++;
    //console.log(questionIndex)
  }
  // Replace the question block with the new block HTML
  document.querySelector('.question-block').innerHTML = questionBlock;
  //console.log(questions)
  if(blockIndex===11){
    document.querySelector('.next-btn').textContent = "Дізнатись результат";
  }
}

// Function to move to the next block of questions
function nextBlock() {
  // Increment the block index and reset the used questions
  blockIndex++;
  //usedQuestions = [];
  document.querySelector('.unanswered-message').style = "display:none";
  // Sum the answer values with the points for the corresponding archetype
  var answerInputs = document.querySelectorAll('.answer input[type="radio"]:checked');
  answerInputs.forEach(function(input) {
    var archetype = input.getAttribute('data-archetype');
    var answerValue = parseInt(input.value);
    if (!isNaN(answerValue) && archetype in points) {
      points[archetype] += Number(answerValue);
    }
  });
  // If there are more blocks, display the next one
  if (blockIndex < Math.ceil(questions.length / 6)) {
    displayBlock();
  } else {
    // Otherwise, submit the answers
    submitAnswers();
  }
  // Display the new total score for each archetype

}


function checkUnansweredQuestions() {
  var blocks = document.querySelectorAll('.question-block');
  var totalUnansweredQuestions = 0;
  //document.querySelector('.next-btn').style.display = "none"

  blocks.forEach(function(block, index) {
    var answeredQuestions = block.querySelectorAll('.answer input[type="radio"]:checked');
    if (answeredQuestions.length !== 6) {
      var unansweredQuestions = 6 - answeredQuestions.length;
      document.querySelector('.unanswered-message').style.display = "";
      document.querySelector('.unanswered-message').textContent = "Ви пропустили " + unansweredQuestions + " запитань. Будь ласка, оберіть відповіді для продовження тесту.";
      totalUnansweredQuestions += unansweredQuestions;
    }
  });
  if (totalUnansweredQuestions === 0) {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth'});
    nextBlock();
  }
  if(blockIndex===12){
    document.querySelector('.next-btn').style.display = "none";
  }
}
// Function to submit the answers
function submitAnswers() {
  // Get all the answer inputs
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth'});
  var answerInputs = document.querySelectorAll('.answer input[type="radio"]');
  var answers = [];
    // Loop through the answer inputs and add the selected values to the answers array
    answerInputs.forEach(function(input) {
      if (input.checked) {
        var archetype = questions[input.name.split('-')[1]].archetype;
        //points[archetype] += parseInt(input.value);
        answers.push(parseInt(input.value));
      }
    });

    var allArchetypes = Object.keys(points).sort(function(a, b) {
      return points[b] - points[a];
    });
    // Find the top 3 archetypes with the highest score
    var topArchetypes = Object.keys(points).sort(function(a, b) {
      return points[b] - points[a];
    }).slice(0,3);
    console.log(topArchetypes);
    // Display the result to the user
    var resultHtml = '<div class="result">';
    // Display all the archetypes with their scores
    allArchetypes.forEach(function(archetype) {
      var archetypeHtml = '<div class="result-archetype">' + archetype + ' (' + points[archetype] + ' балів)</div>';
      // Add an additional div for the first 3 archetypes
      if (topArchetypes.includes(archetype)) {
      var result = description.find(function(obj) {
          return obj.name === archetype;
        });
        archetypeHtml = '<div class="top-archetype">'+archetypeHtml + '<div class="result-archetype-top-description">'  + result.description + '</div></div>';
      }
      resultHtml += archetypeHtml;
    });

    resultHtml += '</div>';
    resultHtml += '<div class="poits-mean"><div class="poits-mean-content">';
    resultHtml += '<h1>Що означають бали?</h1>';
    resultHtml += '<h2><b>24-30:</b> Це найактивніші архетипи у вашому житті. Якщо у вас немає балів у цьому діапазоні, то 2 найсильніші архетипи з групи "18-23 балів" є найбільш активними для вас.</h2>';
    resultHtml += '<h2><b>18-23:</b> Це архетипи, до яких звертаєтесь, коли вони вам потрібні. Але вони не визначають вашу картину світу (якщо вони не є найвищими).</h2>';
    resultHtml += '<h2><b>12-17:</b> Ці архетипи не часто виражаються у вашому житті в даний час, і, можливо, вам важко зрозуміти людей, які їх виражають активно.</h2>';
    resultHtml += '<h2><b>6-11:</b> Ви майже відмовилися від цих архетипів, тому що ви засвоїли, що вони небажані, або тому, що вони, можливо, були надмірно виражені в минулому.</h2>';
    resultHtml += '</div></div>';
    document.querySelector("#container-1").textContent = "Вітаємо з проходженням тесту!"
    document.querySelector("#container-2").textContent = "За результатами відповідей ваші провідні архетипи:"
    document.querySelector('.question-block').innerHTML = resultHtml;
}
