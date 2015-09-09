define([
        'jquery',
        'hogan',
        'text!../templates/results.hjs'
    ],
    function($, Hogan, resultsTemplate) {
        $(function(){  //use this wrapper to ake sure jquery is ready to rock and roll before we do anything

            var selectedAnswerURL;  //this will be set to the url to post a response for the selected answer

            //set up a click handler for anytime the answer selection changes
            $('.answerOption').click(function(e){
                //save the url to post to on submit
                selectedAnswerURL = e.target.value;
                $('.submit').removeClass('disabled');
            });

            //set up a click handler for the submit button
            $('.submit').click(function(e){
                if (!selectedAnswerURL) return; //ignore clicks on the disabled button

                //make an ajax call to add a new response for the selected error
                var ajaxOptions = {
                    method: 'POST',
                    dataType: 'json',
                    context: document.body,
                    error: ajaxError,
                    success: requestSuccess
                };
                $.ajax(selectedAnswerURL,ajaxOptions);
            });

            //generic error handler for any of the ajax calls
            var ajaxError = function(jqXHR, textStatus, errorThrown){
                //should do something elegant here to show the error to the user but for now I'll just log it to the console
                console.error(errorThrown);
            };

            //success handler for the ajax call that creates a response
            var requestSuccess = function(data, textStatus, jqXHR){
                //make another request to get the full list of answers with their updated response counts
                //(since other answers may have been submitted while we were on the page)
                var ajaxOptions = {
                    method: 'GET',
                    dataType: 'json',
                    context: document.body,
                    error: ajaxError,
                    success: showResults
                };
                $.ajax(quesiton_url + '/answers',ajaxOptions);
            };

            var showResults = function(answers, textStatus, jqXHR){
                //compile and render our partial hogan template
                var html = Hogan.compile(resultsTemplate).render({answers: answers});
                //and replace the answers div with our new results div
                $('#divAnswers').replaceWith(html);
            };
        });
    }
);
