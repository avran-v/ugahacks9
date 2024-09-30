// Character countdown functionality
const colorDescription = document.getElementById('colorDescription');
const charCountdown = document.getElementById('charCountdown');

colorDescription.addEventListener('input', function() {
    const remaining = 50 - colorDescription.value.length;
    charCountdown.textContent = `${remaining} characters remaining`;
});

// Generate palette based on user input
const generatePalette = document.getElementById('generatePalette');
const paletteResults = document.getElementById('paletteResults');
const colorPalette = document.getElementById('colorPalette');

document.getElementById('generatePalette').addEventListener('click', async function () {
    const description = document.getElementById('colorDescription').value.trim();

    if (description.length === 0) {
        alert('Please describe the color palette you want!');
        return;
    }

    // Call the AI-powered getGeneratedColors function
    const generatedColors = await getGeneratedColors(description);

    // Display the color palette
    const colorPalette = document.getElementById('colorPalette');
    colorPalette.innerHTML = '';  // Clear previous results

    generatedColors.forEach(color => {
        const colorContainer = document.createElement('div');
        colorContainer.classList.add('color-container');

        // Create the color box
        const colorBox = document.createElement('div');
        colorBox.classList.add('color-box');
        colorBox.style.backgroundColor = color;

        // Create the hex input field
        const hexBox = document.createElement('div');
        hexBox.classList.add('hex-box');

        const hexInput = document.createElement('input');
        hexInput.classList.add('hex-input');
        hexInput.value = color;
        hexInput.readOnly = true;

        // Create the clipboard icon
        const clipboardIcon = document.createElement('img');
        clipboardIcon.classList.add('clipboard-icon');
        clipboardIcon.src = 'https://cdn-icons-png.flaticon.com/512/60/60990.png';  // Clipboard icon URL

        // Add click-to-copy functionality for both input and clipboard icon
        const copyToClipboard = () => {
            hexInput.select();
            document.execCommand('copy');
            alert(`Copied: ${hexInput.value}`);
        };

        // Attach event listener for both input and icon
        hexBox.addEventListener('click', copyToClipboard);
        clipboardIcon.addEventListener('click', copyToClipboard);

        // Append the elements
        hexBox.appendChild(hexInput);
        hexBox.appendChild(clipboardIcon);
        colorContainer.appendChild(colorBox);
        colorContainer.appendChild(hexBox);
        colorPalette.appendChild(colorContainer);
    });

    document.getElementById('paletteResults').style.display = 'block';
});



async function getGeneratedColors(description) {
    const apiKey = ''; //replace with actual api key

    // Prepare the API request payload
    const data = {
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are an expert in color theory. Given a description, generate an accessible color palette that matches the description. Provide 6 colors, 3 darker and 3 lighter, in hex codes.'
            },
            {
                role: 'user',
                content: `Generate a color palette based on this description: "${description}". I need 6 hex codes, 3 darker and 3 lighter.`
            }
        ],
        max_tokens: 150  // Limit tokens to ensure enough space for hex codes
    };

    try {
        // Make the API call using fetch
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(data),
        });

        // Log the raw response to inspect it
        const result = await response.json();
        console.log('API Response:', result);  // Log the entire API response

        // Check if the response contains a message
        if (result.choices && result.choices.length > 0) {
            const aiText = result.choices[0].message.content;
            console.log('AI Response Text:', aiText);  // Log the AI's text output

            // Extract hex codes from the response
            const hexCodes = aiText.match(/#[0-9A-Fa-f]{6}/g);  // Extract hex codes from GPT's response
            if (hexCodes && hexCodes.length >= 6) {
                return hexCodes.slice(0, 6);  // Return the first 6 hex codes
            } else {
                throw new Error('Failed to generate enough color codes.');
            }
        } else {
            throw new Error('Invalid API response format.');
        }
    } catch (error) {
        console.error('Error generating colors:', error);
        return ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#57FFF3', '#F1C40F'];  // Return fallback colors
    }
}

