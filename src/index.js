import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

// Wait for the SDK to be ready
await AddOnSdk.ready;

// Reference to the active document
const sdkDocument = AddOnSdk.app;

const response = await AddOnSdk.app.document.createRenditions({
  range: "currentPage",
  format: "image/jpeg",
});

const downloadUrl = URL.createObjectURL(response[0].blob);
console.log(downloadUrl);
document.getElementById("anchor").href = downloadUrl;
//document.getElementById("download-button").style.display = 'inline-block';

const imageBlob = response[0].blob;
const imageUrl = URL.createObjectURL(imageBlob);
document.getElementById("image1").src = imageUrl;
document.getElementById("image2").src = imageUrl;
document.getElementById("image3").src = imageUrl;
document.getElementById("image-container").style.display = "flex";
