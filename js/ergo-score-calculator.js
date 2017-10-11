var ergoScoreCalculator = (function() {
  var calculatorForm,
    scoreContainer;

  function processCalculatorForm(event) {
    event.preventDefault();

    var distance = document.querySelector('[name=distance]').value;
    var weight = document.querySelector('[name=weight]').value;
    var age = document.querySelector('[name=age]').value;
    var gender = document.querySelector('[name=gender]:checked').value;
    var formError = validateForm(distance, weight, age, gender);

    if(formError) {
      alert(formError);
    } else {
      calculateScore(distance, weight, age, gender);
    }
  }

  function validateForm(distance, weight, age, gender) {
    var error = null;
    if (distance === '' || weight === '' || age === '' || gender === '') {
      error = 'Alle velden moeten worden ingevuld';
    }
    return error;
  }

  function genderMultiplier(gender) {
    return gender === 'f' ? 120 : 100;
  }

  function weightFactor(weightInLbs) {
    return Math.pow(weightInLbs / 270, 0.222);
  }

  function kgToLbs(weightInKg) {
    return weightInKg * 2.2046;
  }

  function parseWeightInput(weight) {
    return parseFloat(weight.replace(',', '.'));
  }

  function compensateDistance(distance, weightInLbs) {
    return distance / weightFactor(weightInLbs);
  }

  function parseAgeFactor(age) {
    ageDifference = parseInt(age) > 30 ? age - 30 : 0;
    factor = 100 * Math.pow(1 - 0.0065, ageDifference);
    return parseFloat(factor).toFixed(2);
  }

  function calculateScore(distance, weight, age, gender) {
    var ageFactor = parseAgeFactor(age);
    var parsedWeight = kgToLbs(parseWeightInput(weight));
    var compensatedDistance = compensateDistance(distance, parsedWeight);
    var finalScore = compensatedDistance / ageFactor * genderMultiplier(gender);

    scoreContainer.innerText = parseFloat(finalScore).toFixed(0);
    scoreContainer.scrollIntoView();

    console.log({
      score: finalScore,
      distance: {
        input: distance,
        compensated: compensatedDistance
      },
      weight: {
        input: weight,
        parsed: parseWeightInput(weight),
        lbs: parsedWeight,
        factor: weightFactor(parsedWeight)
      },
      age: {
        input: age,
        factor: ageFactor
      },
      gender: {
        input: gender,
        multiplier: genderMultiplier(gender)
      }
    });
  };

  var init = function() {
    calculatorForm = document.querySelector('#ergoCalculator');
    scoreContainer = document.querySelector('#score');

    calculatorForm.addEventListener('submit', processCalculatorForm, false);
  };

  return {
    init: init
  };
}());
