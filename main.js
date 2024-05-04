// Select Elements
let count = document.querySelector('.count span');
let spans = document.querySelector(".spans");
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector('.bullets');
let results = document.querySelector('.results');
let countdownElement = document.querySelector('.countdown');

let nowAnswer = 0;
let rightAnswers = 0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let myJson = JSON.parse(this.responseText);

            createBullets(myJson.length);

            addQuestionData(myJson[nowAnswer], myJson.length);

            countdown(100, myJson.length);

            submitButton.onclick = () => {

                checkAnswer(myJson[nowAnswer].right_answer, myJson.length);

                quizArea.innerHTML = '';
                answersArea.innerHTML = '';

                nowAnswer++;

                addQuestionData(myJson[nowAnswer], myJson.length);

                handleBullets();

                showResults(myJson.length);

                clearInterval(countdownInterval);
                countdown(100, myJson.length);
            }
        }
    };

    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}

getQuestions();

function createBullets(num) {
    count.innerHTML = num;

    // Create Spans
    for(let i = 0; i < num; i++) {
        let span = document.createElement('span');

        if(i === 0) span.classList.add('on');

        spans.appendChild(span);
    }
}

function addQuestionData(obj, count) {
    if(count > nowAnswer) {
        let h2 = document.createElement('h2');
        let textH2 = document.createTextNode(obj['title']);
        h2.appendChild(textH2);
        quizArea.appendChild(h2);
    
        for(let i = 1; i <= 4; i++) {
            let answer = document.createElement('div');
            answer.className = 'answer';
    
            let input = document.createElement('input');
            input.type = "radio";
            input.id = `answer_${i}`;
            input.name = "question";
            input.dataset.answer = obj[`answer_${i}`];
            answer.appendChild(input);
    
            if(i === 1) {
                input.checked = true;
            }
    
            let label = document.createElement('label');
            label.htmlFor = `answer_${i}`;
            label.textContent = obj[`answer_${i}`];
            answer.appendChild(label);
    
            answersArea.appendChild(answer);
        }
    }
}

            
function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let checkedAnswer;

    for(let i = 0; i < answers.length; i++) {
        if(answers[i].checked) {
            checkedAnswer = answers[i].dataset.answer;
        }
    }

    if(checkedAnswer === rAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletSpans = document.querySelectorAll(".spans span");
    
    bulletSpans.forEach((span, index) => {
        if(nowAnswer === index) {
            span.className = 'on';
        }
    });
}

function showResults(count) {
    if(count == nowAnswer) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswers < count && rightAnswers > (count / 2)) {
            results.innerHTML = `<span class="good">Good</span>, You Answered ${rightAnswers} From ${count}`
        } else if(rightAnswers == count) {
            results.innerHTML = `<span class="perfect">Perfect</span>, You Answered ${rightAnswers} From ${count}`
        } else {
            results.innerHTML = `<span class="bad">Bad</span>, You Answered ${rightAnswers} From ${count}`
        }

        results.style.padding = '10px';
        results.style.backgroundColor = 'white';
        results.style.marginTop = '10px';
    }
}

function countdown(duration, count) {
    if(nowAnswer < count) {
        let minutes, seconds;

        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes; 
            
            seconds = parseInt(duration % 60);
            seconds = seconds < 10 ? `0${seconds}` : seconds; 
            
            countdownElement.innerHTML = `${minutes} : ${seconds}`;

            if(--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }

        }, 1000);
    }
}