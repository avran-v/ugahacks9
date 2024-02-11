function updateColorSquare(inputId, squareId) {
<<<<<<< HEAD
    const colorInput = document.getElementById(inputId).value.trim();
    const colorSquare = document.getElementById(squareId);
    colorSquare.style.backgroundColor = colorInput.startsWith("#")
      ? colorInput
      : "#" + colorInput;
  }
  
  document
    .getElementById("foregroundColor")
    .addEventListener("input", function () {
      updateColorSquare("foregroundColor", "foregroundSquare");
    });
  
  document
    .getElementById("backgroundColor")
    .addEventListener("input", function () {
      updateColorSquare("backgroundColor", "backgroundSquare");
    });
  
  document.getElementById("checkContrast").addEventListener("click", function () {
    const foregroundColor = document
      .getElementById("foregroundColor")
      .value.trim();
    const backgroundColor = document
      .getElementById("backgroundColor")
      .value.trim();
  
    const apiUrl = `https://webaim.org/resources/contrastchecker/?fcolor=${foregroundColor}&bcolor=${backgroundColor}&api`;
  
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const resultDiv = document.getElementById("result");
  
        // Display a checkmark or cross based on the contrast results
        const aaResult = data.AA === "pass" ? "✓" : "✗";
        const aaaResult = data.AAA === "pass" ? "✓" : "✗";
        const aaLargeResult = data.AALarge === "pass" ? "✓" : "✗";
        const aaaLargeResult = data.AAALarge === "pass" ? "✓" : "✗";
  
        document.getElementById("AA").innerHTML = aaResult;
        document.getElementById("AAA").innerHTML = aaaResult;
        document.getElementById("AALarge").innerHTML = aaLargeResult;
        document.getElementById("AAALarge").innerHTML = aaaLargeResult;
        document.getElementById("textAA").innerHTML = "AA";
        document.getElementById("textAAA").innerHTML = "AAA";
        document.getElementById("textAA3").innerHTML = "AA";
        document.getElementById("textAAA3").innerHTML = "AAA";
  
        document.getElementById("AA2").innerHTML = aaResult;
        document.getElementById("AAA2").innerHTML = aaaResult;
        document.getElementById("AALarge2").innerHTML = aaLargeResult;
        document.getElementById("AAALarge2").innerHTML = aaaLargeResult;
        document.getElementById("textAA2").innerHTML = "AA";
        document.getElementById("textAAA2").innerHTML = "AAA";
        document.getElementById("textAA2A").innerHTML = "AA";
        document.getElementById("textAAA2A").innerHTML = "AAA";
  
        resultDiv.innerHTML = `
            <p>Contrast Ratio: ${data.ratio}</p>
          `;
  
        const newDiv = document.createElement("div");
  
        newDiv.innerHTML = `
           <div class="color-square" id="newForeSquare"></div>
        <div class="color-square" id="newBackSquare"></div>
         `;
        document.getElementById("tableResult").appendChild(newDiv);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  });



  
=======
  const colorInput = document.getElementById(inputId).value.trim();
  const colorSquare = document.getElementById(squareId);
  colorSquare.style.backgroundColor = colorInput.startsWith("#")
    ? colorInput
    : "#" + colorInput;
}

document
  .getElementById("foregroundColor")
  .addEventListener("input", function () {
    updateColorSquare("foregroundColor", "foregroundSquare");
  });

document
  .getElementById("backgroundColor")
  .addEventListener("input", function () {
    updateColorSquare("backgroundColor", "backgroundSquare");
  });

document.getElementById("checkContrast").addEventListener("click", function () {
  const foregroundColor = document
    .getElementById("foregroundColor")
    .value.trim();
  const backgroundColor = document
    .getElementById("backgroundColor")
    .value.trim();

  const apiUrl = `https://webaim.org/resources/contrastchecker/?fcolor=${foregroundColor}&bcolor=${backgroundColor}&api`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const resultDiv = document.getElementById("result");

      // Display a checkmark or cross based on the contrast results
      const aaResult = data.AA === "pass" ? "✓" : "✗";
      const aaaResult = data.AAA === "pass" ? "✓" : "✗";
      const aaLargeResult = data.AALarge === "pass" ? "✓" : "✗";
      const aaaLargeResult = data.AAALarge === "pass" ? "✓" : "✗";

      document.getElementById("AA").innerHTML = aaResult;
      document.getElementById("AAA").innerHTML = aaaResult;
      document.getElementById("AALarge").innerHTML = aaLargeResult;
      document.getElementById("AAALarge").innerHTML = aaaLargeResult;
      document.getElementById("textAA").innerHTML = "AA";
      document.getElementById("textAAA").innerHTML = "AAA";
      document.getElementById("textAA3").innerHTML = "AA";
      document.getElementById("textAAA3").innerHTML = "AAA";

      document.getElementById("AA2").innerHTML = aaResult;
      document.getElementById("AAA2").innerHTML = aaaResult;
      document.getElementById("AALarge2").innerHTML = aaLargeResult;
      document.getElementById("AAALarge2").innerHTML = aaaLargeResult;
      document.getElementById("textAA2").innerHTML = "AA";
      document.getElementById("textAAA2").innerHTML = "AAA";
      document.getElementById("textAA2A").innerHTML = "AA";
      document.getElementById("textAAA2A").innerHTML = "AAA";

      resultDiv.innerHTML = `
          <p>Contrast Ratio: ${data.ratio}</p>
        `;

      const newDiv = document.createElement("div");

      newDiv.innerHTML = `
         <div class="color-square" id="newForeSquare"></div>
      <div class="color-square" id="newBackSquare"></div>
       `;
      document.getElementById("tableResult").appendChild(newDiv);
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });
});
>>>>>>> 818f2de133964a7d5bf8e90788af7b75d6782177
