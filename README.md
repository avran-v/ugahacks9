## Team members
Keerthi Veeramachaneni, Misry Dhanani, Shriya Rasale, and Subhasini Udhyakumar

## Inspiration
All of our team has had experience making websites or designs; however, having to use different resources to check and make our design more accessible makes the designing process longer and more tedious. We wanted to design something that would empower designers to become their own superheroes and save the world from inaccessible designs in all-in-one add-on.

## What it does
Designers who use Adobe Express can use our plugin to see how accessible their design is. If the user plugs in the hex values of a design they have, then they will be able to get the contrast ratio, WCAG compliance, and color recommendations based on a custom formula. Our add-on also displays what the user’s design would look like for people with different visual impairments.

## How we built it
We conceptualized our project on Figma. We also used the Adobe Express Add-on UI SDK in order to export the project file as an image and use it in our add-on. We built our add-on using HTML, CSS, JavaScript, Node.js, and React.  We also used the rgblind open-source JS library to get the filters for the different color blindnesses. Another resource was the WebAIM Contrast Checker API to find the contrast ratio and WCAG compliance of two colors. Lastly, we used the Color API to convert from RGB to HSL so that we can generate recommendations for better colors. 

## Challenges we ran into
- We embraced the spirit of our inner superheroes and took up the challenge of limited documentation, tutorials, and resources to help us because Adobe Express is so new. Since the technology was so new and still in development, we spent a lot of time trying to figure out how to solve our technical issues.
-  Adobe Express is not yet allowing developers to extract certain metadata such as color or text size from the user’s designs which could have allowed us to use a color picker or generate a color palette from the design, so we decided to ask the user to input the hex values.
-  We also tried to use multiple different APIs that would give a recommended color palette depending on the user’s input color, but the colors were all not high enough in contrast to pass the guidelines. This is when we pivoted to try and calculate colors with better contrast. The obstacles we encountered were stepping stones on the path to innovation, and our ability to adapt showcased the superhero spirit.

## Accomplishments that we're proud of
In the face of the unknown, our team emerged victorious using a technology as new as Adobe Express that did not have much documentation and overcame the obstacle by turning limitations into opportunities and created a fully functional professional add-on. We also successfully connected different libraries and APIs working under a tight deadline.

## What we learned
We learned how to develop an add-on for Adobe Express. As newcomers to these technologies, deciphering extensive documentation became a substantial part of our learning process. Through overcoming obstacles, we gained valuable insights into troubleshooting. We researched about the importance of accessibility and the different WCAG guidelines that designers need to follow in order to be compliant with federal laws. Throughout the process, we learned to empathize with people who are visually impaired. This experience enriched our understanding to creating technology that serves diverse user needs.

## What's next for Accessify
Next thing, we plan to implement is users getting recommended colors and the option to add that color to their design directly. When we can have more access to Adobe Express's metadata about the user’s designs we can directly extract the colors from their design to calculate contrast rather than having the user input the hex values themselves. We would also like to add more types of vision impairments to our color blindness filter tab (such as Blue color blindness, Complete color blindness, and Achromatopsia).

Credits

rgblind open-source JS library

    - Copyright (c) 2016 Interaktiva rum Sverige (Interactive rooms Sweden)

    - Website: http://www.interaktivarum.se/en

    - Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions.

WebAIM Contrast Checker API

    - Website: https://webaim.org/resources/contrastchecker/

The Color API:

    - Website: https://www.thecolorapi.com/


## Setup

1. To install the dependencies, run `npm install`.
2. To build the application, run `npm run build`.
3. To start the application, run `npm run start`.
