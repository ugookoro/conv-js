function conv(params) {
    let questions = [];

    (function getQuestions(doc) {
        var questionContainers = doc.getElementsByClassName(params.selector);
        console.log("Containers", "There are " + questionContainers.length + " containers");
        console.log("Containers", questionContainers);

        for (i = 0; i < questionContainers.length; i++) {
            questions = questionContainers[i].getElementsByClassName('question');                      
            if (questions.length !== 0) {
                var count = 0;
                console.log("Question", "There are " + questions.length + " questions");
                for (j = 0; j < questions.length; j++) {
                    var att = doc.createAttribute("data-step");       // Create a "class" attribute
                    att.value = count;                           // Set the value of the class attribute
                    questions[j].setAttributeNode(att);
                    count++;
                    if (j === 0) {
                        questions[j].classList.add('active');
                    }                   
                }
            } else {
            }
        }

    })(document);


    //Form opener trigger
    document.addEventListener('click', function (evt) { 
        var element = evt.target;
        if (element.hasAttribute('data-conv-target')) {
            var target = element.getAttribute('data-conv-target');
            document.querySelector(target).style.display = 'flex';
        }               
        if (element.hasAttribute('data-conv-close')) {
            var target = element.getAttribute('data-conv-close');
            document.querySelector(target).style.display = 'none';
        }   
        
        if(element.classList.contains('conv-next')){
            var questionContainer = element.parentElement.parentElement;
            var currentActiveQuestion = questionContainer.querySelectorAll('.active')[0];
            var currentActiveStep = currentActiveQuestion.getAttribute('data-step');
            var nextStep = Number(currentActiveStep) + 1;
            var nextQuestion = questionContainer.querySelectorAll('[data-step="'+nextStep+'"]')[0];
            if (nextQuestion) {
                currentActiveQuestion.classList.remove('active');
                nextQuestion.classList.add('active');                
            } else {

                //submit the form because there's no next
            }   
        }

        if(element.classList.contains('conv-back')){
            var questionContainer = element.parentElement.parentElement;
            var currentActiveQuestion = questionContainer.querySelectorAll('.active')[0];
            var currentActiveStep = currentActiveQuestion.getAttribute('data-step');
            var nextStep = Number(currentActiveStep) - 1;
            var nextQuestion = questionContainer.querySelectorAll('[data-step="'+nextStep+'"]')[0];
            if (nextQuestion) {
                currentActiveQuestion.classList.remove('active');
                nextQuestion.classList.add('active');                
            } else {
                //do nothing
            }   
        }
    }, false);   



}

