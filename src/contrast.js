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

document.getElementById("foregroundColor").addEventListener("input", function () {
  updateColorSquare("foregroundColor", "foregroundSquare");
});

document.getElementById("backgroundColor").addEventListener("input", function () {
  updateColorSquare("backgroundColor", "backgroundSquare");
});

document.getElementById("checkContrast").addEventListener("click", function () {
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

          const resultDiv = document.getElementById("result");
          resultDiv.innerHTML = "Contrast results updated.";
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
          const resultDiv = document.getElementById("result");
          resultDiv.innerHTML = "Error fetching data. Please try again.";
      });
});


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
