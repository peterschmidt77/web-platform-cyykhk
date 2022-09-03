var currentQuestionNo = 0;
var points = 0;
var rightAnswerPoints = 1;
var currentQuestion;
var status = 'init';
const indices = new Array();
var selectedGruppe = 0;
var questions = new Array();

$(function () {
  $('#btnGruppe1').text(gruppen[0].name);
  $('#btnGruppe2').text(gruppen[1].name);
  $('#btnGruppe3').text(gruppen[2].name);
  $('#btnGruppe4').text(gruppen[3].name);
  $('#btnGruppe5').text(gruppen[4].name);
});

$('.start').click(function () {
  console.log('Start');
  $('.quiz_start').fadeOut(function () {
    startQuiz();
  });
});

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function showNextQuestion() {
  $('#tbAnswer').val('');
  $('#lblRightAnswer').text('');
  $('#tbAnswer').removeClass('red');
  $('#tbAnswer').removeClass('green');
  $('#divOption2').hide();
  $('#divOption3').hide();
  if (currentQuestionNo >= questions.length) {
    showEnd();
    currentQuestionNo = 0;
    status = 'end';
  } else {
    status = 'answer';
  }
  showStatus();
  console.log(
    'questions.length = ' +
      questions.length +
      ', currentQuestionNo = ' +
      currentQuestionNo +
      ', indices[currentQuestionNo] = ' +
      indices[currentQuestionNo]
  );
  currentQuestion = questions[indices[currentQuestionNo]];
  console.log('currentQuestion = ' + currentQuestion);
  console.log('Show Question id = ' + currentQuestion.id);

  $('#qno').text(currentQuestionNo + 1 + '/' + questions.length);
  $('#lblQuestion1').text(currentQuestion.lang1);
  $('#lblQuestion2').text(currentQuestion.lang2);
  currentQuestionNo++;
}

function getRightAnswer() {
  return currentQuestion.lang3;
}

function startQuiz() {
  currentQuestionNo = 0;
  for (i = 0; i < questions.length; i++) {
    indices.push(i);
  }
  shuffle(indices);

  showNextQuestion();
  $('#question').fadeIn();
  $('#continue_btn').hide();
  $('#tbAnswer').focus();
}

$('#answer_commit_btn').click(function () {
  validateAnswer();
});

function validateAnswer() {
  $('#answer_commit_btn').hide();
  var rightAnswer = getRightAnswer();
  var selectedAnswer = $('#tbAnswer').val();
  $('#lblRightAnswer').text(rightAnswer);
  if (currentQuestion.lang3Option2) {
    $('#lblAnswerOption2').text(currentQuestion.lang3Option2);
    $('#divOption2').show();
    if (currentQuestion.lang3Option3) {
      $('#lblAnswerOption3').text(currentQuestion.lang3Option3);
      $('#divOption3').show();
    } else {
      $('#divOption3').hide();
    }
  } else {
    $('#divOption2').hide();
    $('#divOption3').hide();
  }
  if (selectedAnswer.toLowerCase() == rightAnswer.toLowerCase()) {
    //if (selectedAnswer.length > 1
    //&& rightAnswer.toLowerCase().indexOf(selectedAnswer.toLowerCase()) > -1) {
    $('#tbAnswer').addClass('green');
    points += rightAnswerPoints;
  } else {
    $('#tbAnswer').addClass('red');
  }

  $.post('insertEingabe.php', {
    datum: $('#datum').val(),
    Deutsch: currentQuestion.lang3,
    Englisch: currentQuestion.lang2,
    Spanisch: currentQuestion.lang1,
    Eingabe: $('#tbAnswer').val(),
  }).done(function (data) {
    $('#lblServerResponse').html(data);
  });
}

//$("#tbAnswer").on('keypress',function(e) {
$(document).on('keypress', function (e) {
  if (e.which == 13) {
    //alert();
    showStatus();
    if (status == 'init') {
      status = 'answer';
      showStatus();
      $('.quiz_start').fadeOut(function () {
        startQuiz();
      });
      //showNextQuestion();
    } else if (status == 'end') {
      showStatus();
      $('.quiz_end').fadeOut();
      status = 'init';
      $('.quiz_start').fadeIn();
      //startQuiz();
    } else if (status == 'answer') {
      validateAnswer();
      status = 'result';
      showStatus();
    } else if (status == 'result') {
      showStatus();
      showNextQuestion();
      status = 'answer';
      showStatus();
    }
    showStatus();
  }
});

$('#continue_btn').click(function () {
  showNextQuestion();
  $('#continue_btn').hide();
  $('#answer_commit_btn').show();
});

$('#btnSelect').click(function () {
  /*
	var response = $.ajax({ type: "GET",   
				url: "./select.php",   
				async: false
			  }).responseText;
	$("#lblServerResponse").html(response);
	*/

  $.post('select.php', {
    paramSQL: $('#taSelect').val(),
  }).done(function (data) {
    $('#lblServerResponse').html(data);
  });
});

function showEnd() {
  $('#question').fadeOut(function () {
    $('#endpoints').text(points);
    $('#possiblepoints').text(rightAnswerPoints * questions.length);
    $('.quiz_end').fadeIn();
    status = 'end';
    window.location.href = 'mailto:xyz@something.com';
  });
}

function showStatus() {
  message = '';
  if (status == 'answer') {
    message = 'Bitte geben Sie die Lösung ein';
  } else if (status == 'result') {
    message = 'Weiter mit "Return"';
  } else {
  }
  $('#lblStatus').text(message);
}

function prepareQuestions() {
  var members = new Array();
  questions = new Array();
  for (i = 0; i < gruppen.length; i++) {
    if (gruppen[i].id == selectedGruppe) {
      members = gruppen[i].members;

      for (i = 0; i < material.length; i++) {
        var tempIndex = parseInt(material[i].id);
        //if ($.inArray(tempIndex, members)) {
        if (members.includes(tempIndex)) {
          questions.push(material[i]);
        }
      }
    }
  }
  $('.quiz_start').fadeOut(function () {
    startQuiz();
  });
}

$('#btnGruppe1').click(function () {
  selectedGruppe = 1;
  prepareQuestions();
});

$('#btnGruppe2').click(function () {
  selectedGruppe = 2;
  prepareQuestions();
});

$('#btnGruppe3').click(function () {
  selectedGruppe = 3;
  prepareQuestions();
});
$('#btnGruppe4').click(function () {
  selectedGruppe = 4;
  prepareQuestions();
});
$('#btnGruppe5').click(function () {
  selectedGruppe = 5;
  prepareQuestions();
});
