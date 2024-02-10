function updateColorSquare(inputId, squareId) {
    const colorInput = document.getElementById(inputId).value.trim();
    const colorSquare = document.getElementById(squareId);
    colorSquare.style.backgroundColor = colorInput.startsWith('#') ? colorInput : '#' + colorInput;
  }

  document.getElementById('foregroundColor').addEventListener('input', function() {
    updateColorSquare('foregroundColor', 'foregroundSquare');
  });

  document.getElementById('backgroundColor').addEventListener('input', function() {
    updateColorSquare('backgroundColor', 'backgroundSquare');
  });

  document.getElementById('checkContrast').addEventListener('click', function() {
    const foregroundColor = document.getElementById('foregroundColor').value.trim();
    const backgroundColor = document.getElementById('backgroundColor').value.trim();

    const apiUrl = `https://webaim.org/resources/contrastchecker/?fcolor=${foregroundColor}&bcolor=${backgroundColor}&api`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
       
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
          <p>Contrast Ratio: ${data.ratio}</p>
          <p>AA Pass: ${data.AA}</p>
          <p>AAA Pass: ${data.AAA}</p>
          <p>AA Large Text Pass: ${data.AALarge}</p>
          <p>AAA Large Text Pass: ${data.AAALarge}</p>
        `;
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  });