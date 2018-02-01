function conv(params) {
    var questions = [];

    (function getQuestions(doc) {
        var questionContainers = doc.getElementsByClassName(params.selector);
        // console.log("Containers", "There are " + questionContainers.length + " containers");
        // console.log("Containers", questionContainers);

        for (i = 0; i < questionContainers.length; i++) {
            questions = questionContainers[i].getElementsByClassName('question');                      
            if (questions.length !== 0) {
                var count = 0;
               // console.log("Question", "There are " + questions.length + " questions");
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

            //console.log(questions);
            
        }

        var numericControls = doc.querySelectorAll('.conv-numeric');
        if (numericControls) {            
            for (var i = 0; i < numericControls.length; i++) {
                var control = numericControls[i];
                var input = control.querySelectorAll('input[type="number"]')[0],
                    btnIncrease = control.querySelectorAll('button.increase')[0],
                    btnDecrease = control.querySelectorAll('button.decrease')[0];

                control.setAttribute('id', 'conv-numeric-' + i);
                input.setAttribute('id', 'conv-input-' + i);
                btnIncrease.setAttribute('id', 'conv-inc-' + i);
                btnDecrease.setAttribute('id', 'conv-dec-' + i);

                if (btnIncrease) {
                    btnIncrease.addEventListener('click', function () {
                        var oldValue = input.value === "" ? 0 : parseFloat(input.value);
                        var newVal = oldValue + 1;
                        input.value = newVal;
                        var event = document.createEvent("Event");
                        event.initEvent("change", false, true);
                        input.dispatchEvent(event);
                    })
                }

                if (btnDecrease) {
                    btnDecrease.addEventListener('click', function () {
                        var oldValue = input.value === "" ? 0 : parseFloat(input.value);
                        var newVal = oldValue - 1;
                        input.value = newVal;
                        var event = document.createEvent("Event");
                        event.initEvent("change", false, true);
                        input.dispatchEvent(event);
                    })
                }
                

                
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
            var nextQuestion = questionContainer.querySelectorAll('[data-step="' + nextStep + '"]')[0];

            if (nextStep === questionContainer.getElementsByClassName('question').length - 1) {
                var finishButton = questionContainer.querySelectorAll('.conv-next')[0];
                finishButton.setAttribute('type', 'submit');
                evt.preventDefault()
            }

            //if current active question is required, 
            var questionHasValidation = currentActiveQuestion.hasAttribute('data-conv-validate');
            if (questionHasValidation) {
                var questionIsValid = validate(currentActiveQuestion.getAttribute('data-conv-validate'), currentActiveQuestion)
                if (questionIsValid) {
                    if (nextStep + 1 === questionContainer.getElementsByClassName('question').length) {
                        var finishButton = questionContainer.querySelectorAll('.conv-next')[0];
                        finishButton.setAttribute('type', 'submit');
                    }
                    if (nextQuestion) {
                        replace(questionContainer,currentActiveQuestion);
                        currentActiveQuestion.classList.remove('active');
                        nextQuestion.classList.add('active');                
                    } else {        
                        //var containerType = questionContainer.tagName;
                        //switch (containerType.toLowerCase()) {
                        //    case "form":
                        //    questionContainer.submit();                                                                
                        //        break;                
                        //    default:
                        //    var url = questionContainer.getAttribute('data-url');
                            
                        //        break;
                        //}
                        //console.log("Container type",containerType);
        
                        ////submit the form because there's no next
                    }   
                }else{
                    console.log('Question is InValid');
                }
            } else {
               
                if (nextQuestion) {
                    replace(questionContainer,currentActiveQuestion);                    
                    currentActiveQuestion.classList.remove('active');
                    nextQuestion.classList.add('active');
                    
                } else {
                    
    
                    //var containerType = questionContainer.tagName;
                    //switch (containerType.toLowerCase()) {
                    //    case "form":
                    //    questionContainer.submit();                                                                
                    //        break;                
                    //    default:
                    //    var url = questionContainer.getAttribute('data-url');
                        
                    //        break;
                    //}
                    //console.log("Container type",containerType);
    
                    //submit the form because there's no next
                }  
            }


            //look for callbacks
            var questionHasCallback = currentActiveQuestion.hasAttribute('data-conv-onanswered');
            if (questionHasCallback) {
                var callBackName = currentActiveQuestion.getAttribute('data-conv-onanswered');
                window[callBackName]();
            }
            
           
        }

        if(element.classList.contains('conv-back')){
            var questionContainer = element.parentElement.parentElement;
            var currentActiveQuestion = questionContainer.querySelectorAll('.active')[0];
            var currentActiveStep = currentActiveQuestion.getAttribute('data-step');
            var nextStep = Number(currentActiveStep) - 1;
            var nextQuestion = questionContainer.querySelectorAll('[data-step="'+nextStep+'"]')[0];

            if (nextStep === questionContainer.getElementsByClassName('question').length - 1) {
                var finishButton = questionContainer.querySelectorAll('.conv-next')[0];
                finishButton.setAttribute('type', 'button');
                evt.preventDefault()
            }
            if (nextQuestion) {
                currentActiveQuestion.classList.remove('active');
                nextQuestion.classList.add('active');                
            } else {
                //do nothing
            }   
        }
    }, false);   

    //Question Validator
    function validate(validationType, question) {
        var result = false;
        switch (validationType.toLowerCase()) {
            case 'required':                
                var questionInput = question.querySelectorAll('input')[0] !== undefined ? question.querySelectorAll('input')[0] : question.querySelectorAll('select')[0];
                if(questionInput.value !== undefined && questionInput.value !== null && questionInput.value !== ""){
                    result = true;
                }               
                break;
        
            default:
                break;
        }

        return result
    }

    //Placeholder Replacement
    function replace(questionContainer, currentActiveQuestion) {
        var elementWithReplaceAttribute  = currentActiveQuestion.querySelectorAll('[data-conv-replace]')[0];
        if (elementWithReplaceAttribute) {
            var textToReplace = elementWithReplaceAttribute.getAttribute('data-conv-replace');
            var replacementText = elementWithReplaceAttribute.value;
            //get all placeholders in the container 
            var placeHolders = questionContainer.querySelectorAll('[data-conv-place]');
            for (i = 0; i < placeHolders.length; i++) {                
                var element = placeHolders[i];
               // console.log('element', element);
                if (element.getAttribute('data-conv-place') === textToReplace) {
                    var str = element.innerText || element.textContent;
                    element.innerText =  replacementText;
                    element.textContent =  replacementText;
                }else{

                }                        
            }           
        }  else{
            //console.log('Nothing to replace');
        }              
    }



}

