function updateColorSquare(inputId, squareId) {
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

        addSuggestedColors(foregroundColor, backgroundColor);

        document.getElementById("tableResult").appendChild(newDiv);

      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });

  });

  async function addSuggestedColors(foregroundColor, backgroundColor) {
    const foreColorCheckerUrl = `https://www.thecolorapi.com/id?hex=${foregroundColor}&format=json`;
    console.log(foreColorCheckerUrl); 
    const backColorCheckerUrl = `https://www.thecolorapi.com/id?hex=${backgroundColor}&format=json`;
    console.log(backColorCheckerUrl); 
  
    try {
      const [foreColorResponse, backColorResponse] = await Promise.all([
        fetch(foreColorCheckerUrl).then(res => res.json()),
        fetch(backColorCheckerUrl).then(res => res.json())
      ]);
      const foreColorHSL = [foreColorResponse.hsl.h, foreColorResponse.hsl.s, foreColorResponse.hsl.l];
      const backColorHSL = [backColorResponse.hsl.h, backColorResponse.hsl.s, backColorResponse.hsl.l];

      if(foreColorHSL[2] > backColorHSL[2]){
        if(foreColorHSL[2]*2 <= 95){
            document.getElementById("newForeSquare").style.backgroundColor = `hsl(${foreColorHSL[0]}, ${foreColorHSL[1]}%, ${foreColorHSL[2] * 2}%)`;
            foreColorHSL[2] = foreColorHSL[2] * 2; 
        } else {
            //automatically use light value of 100 
            document.getElementById("newForeSquare").style.backgroundColor = `hsl(${foreColorHSL[0]}, ${foreColorHSL[1]}%, 95%)`; 
            foreColorHSL[2] = 95; 
        }
        document.getElementById("newBackSquare").style.backgroundColor = `hsl(${backColorHSL[0]}, ${backColorHSL[1]}%, ${backColorHSL[2] / 2}%)`;
        backColorHSL[2] = backColorHSL[2]/2; 
      } else {
        //console.log("backcolor is darker or they are the same"); 
        if(backColorHSL[2]*2 <= 95){
            document.getElementById("newBackSquare").style.backgroundColor = `hsl(${backColorHSL[0]}, ${backColorHSL[1]}%, ${backColorHSL[2] * 2}%)`;
            backColorHSL[2] = backColorHSL[2] * 2; 
        } else {
            //automatically use light value of 100
            document.getElementById("newBackSquare").style.backgroundColor = `hsl(${backColorHSL[0]}, ${backColorHSL[1]}%, 95%)`; 
            backColorHSL[2] = 95; 
        }
        document.getElementById("newForeSquare").style.backgroundColor = `hsl(${foreColorHSL[0]}, ${foreColorHSL[1]}%, ${foreColorHSL[2] / 2}%)`;
        foreColorHSL[2] = foreColorHSL[2]/2; 
      }
      getNewHexCodes(foreColorHSL, backColorHSL); 
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }

  async function getNewHexCodes(newForeColor, newBackColor){
    //GET https://www.thecolorapi.com/id?hex=0047AB&rgb=0,71,171&hsl=215,100%,34%&cmyk=100,58,0,33&format=html
    const foreColorCheckerUrl = `https://www.thecolorapi.com/id?hsl=${newForeColor[0]},${newForeColor[1]}%,${newForeColor[2]}%&format=json`;
    const backColorCheckerUrl = `https://www.thecolorapi.com/id?hsl=${newBackColor[0]},${newBackColor[1]}%,${newBackColor[2]}%&format=json`;
    try{
        const [foreColorResponse, backColorResponse] = await Promise.all([
            fetch(foreColorCheckerUrl).then(res => res.json()),
            fetch(backColorCheckerUrl).then(res => res.json())
          ]);
        const newForeColorHex = foreColorResponse.hex.value; 
        const newBackColorHex = backColorResponse.hex.value; 

        const foreHexText = document.createElement("p");
        foreHexText.textContent = newForeColorHex; 
        document.getElementById("newForeSquare").appendChild(foreHexText);
        const backHexText = document.createElement("p");
        backHexText.textContent = newBackColorHex; 
        document.getElementById("newBackSquare").appendChild(backHexText);
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
  }
