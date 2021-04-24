# Instructions

- You will be using the [simpsons Quotes API](https://thesimpsonsquoteapi.glitch.me/) to get from the API quotes from the famous simpsons series.

## Requirements

- First Requirement: (18.5 pt)

  - As a user I want to display a total of 10 quotes from the API in my homepage so that I can browse available quotes.
  - As a user I want to be able to add a quote that I like to my favorites so that I can view it later.

    - How we are going to implement it
      - Create an endpoint and point it to the `/`.
      - Create a callback function that will get 10 quotes from the API.
      - When using the superagent make sure to set the user-agent in the request headers
      ex: `superagent.get(url).set('User-Agent', '1.0').then()` in order for the request to work properly.
      - You will need to render the data using either flex box or the grid style.
      - Add a button that will save the quote and all of its information in our DB table.

- Second Requirement: (18.5)

  - As a user I want a page which displays my saved quotes.
  - As a user I want the quotes displayed in pairs with the characters facing each other so that it looks like each pair is having a conversation [screenshots](screenshots/favorite-quotes.png).

    - How are we going to implement it
      - Create an endpoint and point it to `/favorite-quotes`.
      - Create a callback function that will render the saved quotes from our DB.
      - The way we want to render the data is as it is displayed in the [screenshots](screenshots/favorite-quotes.png). This can be achieved from the characters information provided from the API. Take a look at the 'characterDirection' property returned from the API data.

- Third Requirement (25 pt)
  - As a user I want a page which shows the details of each saved quote so I can either update the information or delete it.

    - How are we going to implement it
      - To access the details page for each quote we will add a hyper link around each rendered image in the `/favorite-quotes` page.
      - The link will redirect us to the `/favorite-quotes/:quote_id` route where it will render the quotes data.
      - In the quotes details page we will want to be able to either update the quote only, or delete it from our database.

- Style guidelines: (18 pt)

  - In the `/` page the data will be display either 4x4 flex or as a 4x4 grid on each row.
  - You will need to render the data as they are shown in the [screenshots](screenshots/home.png). 
  - In the `/favorite-quotes` page, you will need to follow the [screenshots](screenshots/favorite-quotes.png) design to make it look like a conversation.

  - Follow the the design for the details page same as the one in the [screenshots](screenshots/details.png) for it.

  - Add a navbar to navigate between all the pages.
    - Make use of the image in the [public folder](public/img/the_simpsons.png) and display it in the nav as shown in the [screenshots](screenshots/nav.png) for it.
  - Use these colors to style your webpages:
    - For text: #fefb1e
    - For the cards and navigation background: #16a085
    - For the webpages background: #62C8E4
  - Use the font 'sans-serif' for all the fonts in your pages.

- Create a schema for your table with all the required columns(5 pt)

- Deploy your website on heroku. (5 pt)
