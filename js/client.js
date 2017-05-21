var processForm = function(event) {
  event.preventDefault();

  var age = document.querySelector('[name=age]').value;
  var weight = document.querySelector('[name=weight]').value;
  var split = document.querySelector('[name=split]').value;
  var sex = document.querySelector('[name=sex]:checked').value;
  var formError = validate(age, weight, split, sex);

  if(formError) {
    alert(formError);
  } else {
    calculateScore(age, weight, split, sex);
  }
}

var ergoCalculator = document.getElementById('ergoCalculator');
ergoCalculator.addEventListener('submit', processForm, false);

var calculateScore = function(age, weight, split, sex) {
  var result = document.getElementById('score');
  var score = 0;

  pace = paceForSplit(split);
  watts = wattsForPace(pace);
  age_factor = ageFactor(age);
  weight_in_kg = weightInKg(weight);
  sex_multiplier = sex == 'f' ? 115 : 100;

  score = watts / weight_in_kg / age_factor * sex_multiplier;

  result.innerText = parseFloat(score).toFixed(3);

  console.log('Score:', score);
  console.log('Pace:', split, pace);
  console.log('Watts:', watts);
  console.log('Age:', age, age_factor);
  console.log('Weight:', weight, weight_in_kg);
  console.log('Sex:', sex, sex_multiplier);
}

var validate = function(age, weight, split, sex) {
  var error = null;
  if (age === '' || weight === '' || split === '' || sex === '') {
    error = 'Alle velden moeten worden ingevuld';
  } else if (splitMatcher(split) === null) {
    error = 'Vul de split correct in, bijv. 1:55.2'
  }
  return error;
}

var splitMatcher = function(split) {
  return split.match(/(\d):(\d{2}).(\d)/);
};

var paceForSplit = function(split) {
  found = splitMatcher(split);
  if (found !== null) {
    minutes = parseInt(found[1]);
    seconds = parseInt(found[2]);
    tenths = parseInt(found[3]);
    split_in_seconds = parseFloat((minutes * 60 + seconds) + '.' + tenths);

    return split_in_seconds / 500;
  }
};

var wattsForPace = function(pace) {
  return 2.8 / Math.pow(pace, 3);
};

var weightInKg = function(weight) {
  return parseFloat(weight.replace(',', '.'));
};

var ageFactor = function(age) {
  age_difference = parseInt(age) > 30 ? age - 30 : 0;
  factor = 100 * Math.pow(1 - 0.008, age_difference);
  return parseFloat(factor).toFixed(1);
};

