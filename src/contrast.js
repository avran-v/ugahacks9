const counter = -1;
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
      const aaResult =
        data.AA === "pass"
          ? '<span style="color: green; font-size="30px">✓</span>'
          : '<span style="color: red; font-size="30px">✗</span>';
      const aaaResult =
        data.AAA === "pass"
          ? '<span style="color: green; font-size="30px">✓</span>'
          : '<span style="color: red; font-size="30px">✗</span>';
      const aaLargeResult =
        data.AALarge === "pass"
          ? '<span style="color: green; font-size="30px">✓</span>'
          : '<span style="color: red; font-size="30px">✗</span>';
      const aaaLargeResult =
        data.AAALarge === "pass"
          ? '<span style="color: green; font-size="30px">✓</span>'
          : '<span style="color: red; font-size="30px">✗</span>';

      updateButtonColors("normalAAImage", "foregroundColor", "backgroundColor");
      updateButtonColors("largeAAAImage", "foregroundColor", "backgroundColor");

      document.getElementById("AA").innerHTML = aaResult;
      document.getElementById("AAA").innerHTML = aaaResult;
      document.getElementById("AALarge").innerHTML = aaLargeResult;
      document.getElementById("AAALarge").innerHTML = aaaLargeResult;
      document.getElementById("textAA").innerHTML = "AA";
      document.getElementById("textAAA").innerHTML = "AAA";

      const additional = document.getElementById("additional");
      additional.innerHTML = `
      <hr style="border: 2px solid #ddd;">
      <p style="font-size: 16px;">For more information, visit <a href="https://webaim.org" target="_blank">WebAIM</a>.</p>
    `;

      resultDiv.innerHTML = `
      <hr style="border: 2px solid #ddd;">
      <p style="font-size: 16;">Contrast Ratio: </p>
  <p style="font-weight: bold;">${data.ratio}:1</p>
  `;
      let newForeSquare = document.getElementById("newForeSquare");
      let newBackSquare = document.getElementById("newBackSquare");

      if (!newForeSquare || !newBackSquare) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `
    <hr style="border: 2px solid #ddd;">
    <p style="font-size: 16px; margin-left:2px">  Look at alternative colors below!</p>
      <div class="color-square" id="newForeSquare"></div>
      <div class="color-square" id="newBackSquare"></div>
    `;
        document.getElementById("tableResult").appendChild(newDiv);
        newForeSquare = document.getElementById("newForeSquare");
        newBackSquare = document.getElementById("newBackSquare");
      }
      addSuggestedColors(foregroundColor, backgroundColor);
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
      fetch(foreColorCheckerUrl).then((res) => res.json()),
      fetch(backColorCheckerUrl).then((res) => res.json()),
    ]);
    const foreColorHSL = [
      foreColorResponse.hsl.h,
      foreColorResponse.hsl.s,
      foreColorResponse.hsl.l,
    ];
    const backColorHSL = [
      backColorResponse.hsl.h,
      backColorResponse.hsl.s,
      backColorResponse.hsl.l,
    ];

    if (foreColorHSL[2] > backColorHSL[2]) {
      if (foreColorHSL[2] * 2 <= 85) {
        document.getElementById("newForeSquare").style.backgroundColor = `hsl(${
          foreColorHSL[0]
        }, ${foreColorHSL[1]}%, ${foreColorHSL[2] * 2}%)`;
        foreColorHSL[2] = foreColorHSL[2] * 2;
      } else {
        //automatically use light value of 85
        document.getElementById(
          "newForeSquare"
        ).style.backgroundColor = `hsl(${foreColorHSL[0]}, ${foreColorHSL[1]}%, 85%)`;
        foreColorHSL[2] = 85;
      }
      document.getElementById("newBackSquare").style.backgroundColor = `hsl(${
        backColorHSL[0]
      }, ${backColorHSL[1]}%, ${backColorHSL[2] / 2}%)`;
      backColorHSL[2] = backColorHSL[2] / 2;
    } else {
      //console.log("backcolor is darker or they are the same");
      if (backColorHSL[2] * 2 <= 85) {
        document.getElementById("newBackSquare").style.backgroundColor = `hsl(${
          backColorHSL[0]
        }, ${backColorHSL[1]}%, ${backColorHSL[2] * 2}%)`;
        backColorHSL[2] = backColorHSL[2] * 2;
      } else {
        //automatically use light value of 85
        document.getElementById(
          "newBackSquare"
        ).style.backgroundColor = `hsl(${backColorHSL[0]}, ${backColorHSL[1]}%, 85%)`;
        backColorHSL[2] = 85;
      }
      document.getElementById("newForeSquare").style.backgroundColor = `hsl(${
        foreColorHSL[0]
      }, ${foreColorHSL[1]}%, ${foreColorHSL[2] / 2}%)`;
      foreColorHSL[2] = foreColorHSL[2] / 2;
    }
    console.log(foreColorHSL);
    console.log(backColorHSL);
    getNewHexCodes(foreColorHSL, backColorHSL);
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
  }
}

async function getNewHexCodes(newForeColor, newBackColor) {
  //GET https://www.thecolorapi.com/id?hex=0047AB&rgb=0,71,171&hsl=215,100%,34%&cmyk=100,58,0,33&format=html
  const foreColorCheckerUrl = `https://www.thecolorapi.com/id?hsl=${newForeColor[0]},${newForeColor[1]}%,${newForeColor[2]}%&format=json`;
  const backColorCheckerUrl = `https://www.thecolorapi.com/id?hsl=${newBackColor[0]},${newBackColor[1]}%,${newBackColor[2]}%&format=json`;
  try {
    const [foreColorResponse, backColorResponse] = await Promise.all([
      fetch(foreColorCheckerUrl).then((res) => res.json()),
      fetch(backColorCheckerUrl).then((res) => res.json()),
    ]);

    const newForeColorHex = foreColorResponse.hex.value;
    const newBackColorHex = backColorResponse.hex.value;

    /*const foreHexTextDiv = document.getElementById("newForeSquare");
    foreHexTextDiv.innerHTML = `<p>${newForeColorHex}</p>`;

    const backHexTextDiv = document.getElementById("newBackSquare");
    backHexTextDiv.innerHTML = `<p>${newBackColorHex}</p>`;*/
    // const foreHexText = document.createElement("p");
    // foreHexText.textContent = newForeColorHex;
    const firstHexTextDiv = document.getElementById("leftHexText");
    // document.getElementById("leftHexText").appendChild(foreHexText);
    firstHexTextDiv.innerHTML = `
    <p>${newForeColorHex}</p>
    `;

    // const backHexText = document.createElement("p");
    // foreHexText.textContent = newForeColorHex;
    const backHexTextDiv = document.getElementById("rightHexText");
    // document.getElementById("rightHexText").appendChild(foreHexText);
    backHexTextDiv.innerHTML = `
    <p>${newBackColorHex}</p>
    `;
    getContrastRatio(newForeColorHex, newBackColorHex);
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
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
          ? '<span style="color: green; font-size="30px">✓</span>'
          : '<span style="color: red; font-size="30px">✗</span>';
      const aaaResult =
        data.AAA === "pass"
          ? '<span style="color: green; font-size="30px">✓</span>'
          : '<span style="color: red; font-size="30px">✗</span>';
      const aaLargeResult =
        data.AALarge === "pass"
          ? '<span style="color: green; font-size="30px">✓</span>'
          : '<span style="color: red; font-size="30px">✗</span>';
      const aaaLargeResult =
        data.AAALarge === "pass"
          ? '<span style="color: green; font-size="30px">✓</span>'
          : '<span style="color: red; font-size="30px">✗</span>';

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
