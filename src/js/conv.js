function conv(params) {
    var questions = [];

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
                    
                    //var dropdowns = questions[j].getElementsByTagName('select');

                    //for (var k = 0; k < dropdowns.length; k++) {                        
                    //    var element = dropdowns[k];
                    //    const sle = new Selectr(element);
                    //}
                    //     var displayDiv = doc.createElement('div');
                    //     var selectionDiv = doc.createElement('div');                        
                    //     var searchInput = doc.createElement('input');
                    //     searchInput.setAttribute('type', 'text');
                    //     const values = [];
                    //     var itemList = doc.createElement('ul');
                    //     var options = element.options;
                    //     for (var l = 0; l < options.length; l++) {
                    //         var listItem = doc.createElement('li');                                           
                    //         var value = options[l].value;
                    //         var text = options[l].innerText;                            
                    //         values.push(text);
                    //         listItem.setAttribute('data-conv-value', value);
                    //         listItem.setAttribute('data-conv-text', text);
                    //         listItem.innerText = text;
                    //         itemList.appendChild(listItem);                
                    //     }

                    //     console.log(values);

                    //     searchInput.addEventListener('keyup',function(e){
                    //         var target = e.currentTarget;
                    //         var searhText = target.value;
                    //         console.log('Search', searhText);
                            
                    //     });
                    //     selectionDiv.appendChild(searchInput);
                    //     selectionDiv.appendChild(itemList);
                    //     element.insertAdjacentElement('afterend',selectionDiv);
                    //     element.insertAdjacentElement('afterend',displayDiv);
                        
                    // }
                }   
            } else {
            }

            console.log(questions);
            
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

            //Turn last button into submit button
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
                    if (nextQuestion) {
                        replace(questionContainer,currentActiveQuestion);
                        currentActiveQuestion.classList.remove('active');
                        nextQuestion.classList.add('active');                
                    } else {
        
                        var containerType = questionContainer.tagName;
                        switch (containerType.toLowerCase()) {
                            case "form":
                            questionContainer.submit();                                                                
                                break;                
                            default:
                            var url = questionContainer.getAttribute('data-url');
                            
                                break;
                        }
                        console.log("Container type",containerType);
        
                        //submit the form because there's no next
                    }   
                }else{
                    console.log('Question is InValid');
                }
            }else{
                if (nextQuestion) {
                    replace(questionContainer,currentActiveQuestion);                    
                    currentActiveQuestion.classList.remove('active');
                    nextQuestion.classList.add('active');                
                } else {
    
                    var containerType = questionContainer.tagName;
                    switch (containerType.toLowerCase()) {
                        case "form":
                        questionContainer.submit();                                                                
                            break;                
                        default:
                        var url = questionContainer.getAttribute('data-url');
                        
                            break;
                    }
                    console.log("Container type",containerType);
    
                    //submit the form because there's no next
                }  
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
                console.log('element', element);
                if (element.getAttribute('data-conv-place') === textToReplace) {
                    var str = element.innerText || element.textContent;
                    element.innerText =  replacementText;
                    element.textContent =  replacementText;
                }else{

                }                        
            }
            // var containerText = questionContainer.innerText;

            // // containerText = containerText.replace('{{'+textToReplace+'}}', replacementText);

            // // questionContainer.innerHTML = containerText;
            // console.log(containerText);            

            console.log('elementWithReplaceAttribute', elementWithReplaceAttribute);
            console.log('textToReplace', textToReplace);
            console.log('replacementText', replacementText);   
        }  else{
            console.log('Nothing to replace');
        }              
    }



}

