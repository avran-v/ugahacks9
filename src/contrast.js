const counter = -1;

var suggestedColor1; 
var suggestedColor2; 
var lastUpdated = 0; 

function updateColorSquare(inputId, squareId) {
  const colorInput = document.getElementById(inputId).value.trim();
  const colorSquare = document.getElementById(squareId);
  colorSquare.style.backgroundColor = colorInput.startsWith("#")
    ? colorInput
    : "#" + colorInput;
}

function updateButtonColors(buttonId, foregroundId, backgroundId) {
  const foregroundColor = document.getElementById(foregroundId).value.trim();
  const backgroundColor = document.getElementById(backgroundId).value.trim();
  const button = document.getElementById(buttonId);

  button.style.backgroundColor = backgroundColor.startsWith("#")
    ? backgroundColor
    : "#" + backgroundColor;
  button.style.color = foregroundColor.startsWith("#")
    ? foregroundColor
    : "#" + foregroundColor;
}

//document.getElementById("foregroundColor").addEventListener("input", function () {
 // updateColorSquare("foregroundColor", "foregroundSquare");
//});

//document.getElementById("backgroundColor").addEventListener("input", function () {
  //updateColorSquare("backgroundColor", "backgroundSquare");
//});

document.getElementById("checkContrast").addEventListener("click", function () {
  console.log("button works")
  const foregroundColor = document.getElementById("foregroundColor").value.trim();
  const backgroundColor = document.getElementById("backgroundColor").value.trim();

  const apiUrl = `https://webaim.org/resources/contrastchecker/?fcolor=${foregroundColor}&bcolor=${backgroundColor}&api`;

  fetch(apiUrl)
      .then((response) => {
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          return response.json();
      })
      .then((data) => {
          // Show the table
          document.getElementById("tableResult").style.display = "block"; // Show the table

          const aaResult = data.AA === "pass"
              ? '<span style="color: green; font-size: 30px;">✓</span>'
              : '<span style="color: red; font-size: 30px;">✗</span>';
          const aaaResult = data.AAA === "pass"
              ? '<span style="color: green; font-size: 30px;">✓</span>'
              : '<span style="color: red; font-size: 30px;">✗</span>';
          const aaLargeResult = data.AALarge === "pass"
              ? '<span style="color: green; font-size: 30px;">✓</span>'
              : '<span style="color: red; font-size: 30px;">✗</span>';
          const aaaLargeResult = data.AAALarge === "pass"
              ? '<span style="color: green; font-size: 30px;">✓</span>'
              : '<span style="color: red; font-size: 30px;">✗</span>';

          updateButtonColors("normalAAImage", "foregroundColor", "backgroundColor");
          updateButtonColors("largeAAAImage", "foregroundColor", "backgroundColor");

          document.getElementById("AA").innerHTML = aaResult;
          document.getElementById("AAA").innerHTML = aaaResult;
          document.getElementById("AALarge").innerHTML = aaLargeResult;
          document.getElementById("AAALarge").innerHTML = aaaLargeResult;
          document.getElementById("textAA").innerHTML = "AA";
          document.getElementById("textAAA").innerHTML = "AAA";

          let newForeSquare1 = document.getElementById("newForeSquare1");
          let newBackSquare1 = document.getElementById("newBackSquare1");
          let newForeSquare2 = document.getElementById("newForeSquare2");
          let newBackSquare2 = document.getElementById("newBackSquare2");
          let newForeSquare3 = document.getElementById("newForeSquare3");
          let newBackSquare3 = document.getElementById("newBackSquare3");

          if (!newForeSquare1 || !newBackSquare1 || !newForeSquare2 || !newBackSquare2 || !newForeSquare3 || !newBackSquare3) {
            const newDiv = document.createElement("div");
            newDiv.innerHTML = `
              <hr style="border: 2px solid #ddd;">
              <p style="font-size: 16px; margin-left: 2px;">Look at alternative colors below - pick two colors to see their contrast!</p>
              <div class="color-square" id="newForeSquare1"></div>
              <div class="color-square" id="newForeSquare2"></div>
              <div class="color-square" id="newForeSquare3"></div>
              <div class="color-square" id="newBackSquare1"></div>
              <div class="color-square" id="newBackSquare2"></div>
              <div class="color-square" id="newBackSquare3"></div>
            `;
            document.getElementById("tableResult").appendChild(newDiv);
            newForeSquare1 = document.getElementById("newForeSquare1");
            newBackSquare1 = document.getElementById("newBackSquare1");
            newForeSquare2 = document.getElementById("newForeSquare2");
            newBackSquare2 = document.getElementById("newBackSquare2");
            newForeSquare3 = document.getElementById("newForeSquare3");
            newBackSquare3 = document.getElementById("newBackSquare3");
          }
          addSuggestedColors(foregroundColor, backgroundColor);
          newForeSquare1.addEventListener("click", function() {
            dynamicContrastRatio(newForeSquare1.id)
          });
          newForeSquare2.addEventListener("click", function() {
            dynamicContrastRatio(newForeSquare2.id)
          });
          newForeSquare3.addEventListener("click", function() {
            dynamicContrastRatio(newForeSquare3.id)
          });
          newBackSquare1.addEventListener("click", function() {
            dynamicContrastRatio(newBackSquare1.id)
          });
          newBackSquare2.addEventListener("click", function() {
            dynamicContrastRatio(newBackSquare2.id)
          });
          newBackSquare3.addEventListener("click", function() {
            dynamicContrastRatio(newBackSquare3.id)
          });
          const resultDiv = document.getElementById("result");
          //resultDiv.innerHTML = "Contrast results updated.";
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
          const resultDiv = document.getElementById("result");
          resultDiv.innerHTML = "Error fetching data. Please try again.";
      });
});

async function dynamicContrastRatio(divId){
  const element = document.getElementById(divId);
  if (element){
    const style = window.getComputedStyle(element);
    const rgbColor = style.getPropertyValue('background-color');

    const rgbToHex = (rgb) => {
      const rgbValues = rgb.match(/\d+/g).map(Number);
      return `#${rgbValues.map(value => value.toString(16).padStart(2, '0')).join('')}`;
    };
    const hexColor = rgbToHex(rgbColor);

    if (lastUpdated == 0 || lastUpdated == 2) {
      // no colors have been selected 
      suggestedColor1 =  hexColor; 
      lastUpdated = 1; 
    } else if (lastUpdated == 1) { 
      // last color updated was assigned to the second variable 
      suggestedColor2 =  hexColor; 
      lastUpdated = 2; 
    }
    if (typeof suggestedColor1 !== 'undefined' && typeof suggestedColor2 !== 'undefined') {
      getContrastRatio(suggestedColor1, suggestedColor2)
    } 
  }
}

async function addSuggestedColors(foregroundColor, backgroundColor) {
  const foreColorCheckerUrl = `https://www.thecolorapi.com/id?hex=${foregroundColor}&format=json`;
  const backColorCheckerUrl = `https://www.thecolorapi.com/id?hex=${backgroundColor}&format=json`;

  try {
    const [foreColorResponse, backColorResponse] = await Promise.all([
      fetch(foreColorCheckerUrl).then((res) => res.json()),
      fetch(backColorCheckerUrl).then((res) => res.json()),
    ]);

    let foreColorHSL = [
      foreColorResponse.hsl.h,
      foreColorResponse.hsl.s,
      foreColorResponse.hsl.l,
    ];
    let backColorHSL = [
      backColorResponse.hsl.h,
      backColorResponse.hsl.s,
      backColorResponse.hsl.l,
    ];

    const adjustLightness = (hsl, factor) => {
      let newLightness = hsl[2] * factor;
      if (newLightness > 100) newLightness = 100;
      if (newLightness < 0) newLightness = 0;
      return [hsl[0], hsl[1], newLightness];
    };

    let foreShades = [];
    let backShades = [];

    if (foreColorHSL[2] > backColorHSL[2]) {
      foreColorHSL[2] = Math.min(foreColorHSL[2] * 2, 85);
      backColorHSL[2] = backColorHSL[2] / 2;
      foreShades = [
        foreColorHSL,
        adjustLightness(foreColorHSL, 0.85),
        adjustLightness(foreColorHSL, 0.7),
      ];
      backShades = [
        backColorHSL,
        adjustLightness(backColorHSL, 1.15),
        adjustLightness(backColorHSL, 1.3),
      ];
    } else {
      backColorHSL[2] = Math.min(backColorHSL[2] * 2, 85);
      foreColorHSL[2] = foreColorHSL[2] / 2;
      foreShades = [
        foreColorHSL,
        adjustLightness(foreColorHSL, 1.15),
        adjustLightness(foreColorHSL, 1.3),
      ];
      backShades = [
        backColorHSL,
        adjustLightness(backColorHSL, 0.85),
        adjustLightness(backColorHSL, 0.7),
      ];
    }

    document.getElementById("newForeSquare1").style.backgroundColor = `hsl(${foreShades[0][0]}, ${foreShades[0][1]}%, ${foreShades[0][2]}%)`;
    document.getElementById("newForeSquare2").style.backgroundColor = `hsl(${foreShades[1][0]}, ${foreShades[1][1]}%, ${foreShades[1][2]}%)`;
    document.getElementById("newForeSquare3").style.backgroundColor = `hsl(${foreShades[2][0]}, ${foreShades[2][1]}%, ${foreShades[2][2]}%)`;

    document.getElementById("newBackSquare1").style.backgroundColor = `hsl(${backShades[0][0]}, ${backShades[0][1]}%, ${backShades[0][2]}%)`;
    document.getElementById("newBackSquare2").style.backgroundColor = `hsl(${backShades[1][0]}, ${backShades[1][1]}%, ${backShades[1][2]}%)`;
    document.getElementById("newBackSquare3").style.backgroundColor = `hsl(${backShades[2][0]}, ${backShades[2][1]}%, ${backShades[2][2]}%)`;

    // document.getElementById("result").innerHTML += `
    //   <p style="font-size: 14px;">Suggested Foreground Colors:</p>
    //   <div style="display: flex;">
    //     <div style="width: 20px; height: 20px; background-color: hsl(${foreShades[0][0]}, ${foreShades[0][1]}%, ${foreShades[0][2]}%);"></div>
    //     <div style="width: 20px; height: 20px; background-color: hsl(${foreShades[1][0]}, ${foreShades[1][1]}%, ${foreShades[1][2]}%);"></div>
    //     <div style="width: 20px; height: 20px; background-color: hsl(${foreShades[2][0]}, ${foreShades[2][1]}%, ${foreShades[2][2]}%);"></div>
    //   </div>
    //   <p style="font-size: 14px;">Suggested Background Colors:</p>
    //   <div style="display: flex;">
    //     <div style="width: 20px; height: 20px; background-color: hsl(${backShades[0][0]}, ${backShades[0][1]}%, ${backShades[0][2]}%);"></div>
    //     <div style="width: 20px; height: 20px; background-color: hsl(${backShades[1][0]}, ${backShades[1][1]}%, ${backShades[1][2]}%);"></div>
    //     <div style="width: 20px; height: 20px; background-color: hsl(${backShades[2][0]}, ${backShades[2][1]}%, ${backShades[2][2]}%);"></div>
    //   </div>
    // `;
  } catch (error) {
    console.error("There was a problem with fetching color data:", error);
  }
}

async function getContrastRatio(newForeColor, newBackColor) {
  const foregroundColor = newForeColor.substring(1);
  const backgroundColor = newBackColor.substring(1);
  const apiUrl = `https://webaim.org/resources/contrastchecker/?fcolor=${foregroundColor}&bcolor=${backgroundColor}&api`;
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const resultDiv = document.getElementById("result2");
      const aaResult =
        data.AA === "pass"
          ? '<span style="color: green; font-size="30px;">✓</span>'
          : '<span style="color: red; font-size="30px;">✗</span>';
      const aaaResult =
        data.AAA === "pass"
          ? '<span style="color: green; font-size="30px;">✓</span>'
          : '<span style="color: red; font-size="30px;">✗</span>';
      const aaLargeResult =
        data.AALarge === "pass"
          ? '<span style="color: green; font-size="30px;">✓</span>'
          : '<span style="color: red; font-size="30px;">✗</span>';
      const aaaLargeResult =
        data.AAALarge === "pass"
          ? '<span style="color: green; font-size="30px;">✓</span>'
          : '<span style="color: red; font-size="30px;">✗</span>';
      const leftbutton = document.getElementById("normalAAImage1");
      const rightbutton = document.getElementById("largeAAAImage1");
      leftbutton.style.backgroundColor = newBackColor;
      leftbutton.style.color = newForeColor;
      rightbutton.style.backgroundColor = newBackColor;
      rightbutton.style.color = newForeColor;
      document.getElementById("AA2").innerHTML = aaResult;
      document.getElementById("AAA2").innerHTML = aaaResult;
      document.getElementById("AALarge2").innerHTML = aaLargeResult;
      document.getElementById("AAALarge2").innerHTML = aaaLargeResult;
      document.getElementById("textAA2").innerHTML = "AA";
      document.getElementById("textAAA2").innerHTML = "AAA";
      resultDiv.innerHTML = `
      <p style="font-size: 16;">Contrast Ratio: </p>
      <p style="font-weight: bold;">${data.ratio}:1</p>
    `;
      console.log("Contrast Ratio: " + data.ratio);
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });
}