# Artlas

> Ce fichier readme est aussi disponible en [Français](README.fr.md).

## Introduction

Project carried out as part of our **End of Studies Project** (**PFE**) for the year 2023-2024 at ECE Paris.

Web application and API in the form of a social network dedicated to art and artists.

The web application code is accessible at the following address: [web app github repository](https://github.com/Artlas/web). The API code is accessible at the following address: [API github repository](https://github.com/Artlas/nodeAPI).

### Project Description

The Artlas project takes the form of a social network. This social network is presented through a fully responsive website. It is a platform where numerous works of art are offered and where users have the possibility to (re)discover them and to interact with the artists. The platform is also a place where artists can share their works and sell them. The platform is designed to be user-friendly and accessible to all, regardless of their location or familiarity with technology.

#### Project Definition

Artlas allows users to register and share a variety of artistic works, including painting, sculpture, drawing, engraving, and photography. Artists not only have the possibility to post their creations, but also to sell them by setting their own price. Artlas stands out for its ability to accommodate all formats of artwork, unlike other platforms that impose format restrictions.

#### Advantages and Innovations

1. **Multi-platform and Accessibility:** Artlas is accessible via web, desktop, and mobile, making art available anytime, anywhere.
2. **Intuitive Navigation:** The user experience is smooth and intuitive, similar to popular social networks like Instagram.
3. **Virtual Exhibitions:** Users can create or visit virtual exhibitions from their galleries, offering an immersive experience of art online.
4. **Simplified Transactions:** The platform allows for direct purchase of artworks, with full transparency on price and the purchasing process.
5. **Direct Communication:** Artlas facilitates communication between buyers and sellers, fostering a more personal and engaging interaction.

- **Respect for Copyright:** Artlas respects copyright by giving artists full control over their works. Users can also make donations and support the artists they admire.
- **Safe Environment:** With a "like" system but no comments, Artlas maintains a positive and non-toxic environment for its users.
- **For Whom?** Artlas is aimed at the general public, paving the way for the democratization of art. It is ideal for people from all backgrounds who are looking to explore, share, or easily purchase art.
- **Why Choose Artlas?** This platform stands out for its user-friendliness and comprehensive approach to art online, offering an alternative to traditional platforms that do not fully meet the specific needs of artists and art enthusiasts.

In summary, Artlas is the all-in-one platform for art, eliminating barriers between creators and art enthusiasts, and transforming the way art is shared, appreciated, and acquired in the digital world.

#### What Need Does Our Artlas Solution Address?

1. **Accessibility and Visibility for Artists:** Artlas offers a platform where artists from all backgrounds can easily share and showcase their works. This includes emerging or amateur artists who may not have access to traditional galleries or other means of exposure.
2. **Interactivity and Public Engagement:** By allowing users to create and visit virtual exhibitions, Artlas actively engages the public in the artistic experience, going beyond mere visualization to create an immersive experience.
3. **Direct and Transparent Commerce:** Artlas facilitates the direct sale of artworks, allowing artists to set their own prices and buyers to clearly understand what they are purchasing, creating a more transparent and fair market.
4. **Diversity of Formats:** The platform is designed to accept various formats of artworks, unlike other platforms that limit the accepted formats. This allows for greater creative expression and the ability to share works that would otherwise not be visible online.
5. **Community Support:** With options to subscribe and donate to artists, Artlas creates a sense of community and provides a way for art enthusiasts to directly support creators.
6. **Positive and Safe Environment:** By avoiding comments and focusing on "likes," Artlas aims to create an online environment free from toxicity, encouraging positive and respectful appreciation of art.
7. **Democratization of Art:** Artlas opens the doors of art to a wider audience, including those who may feel excluded from traditional artistic circles. This allows for greater inclusion and diversity in the art world.
8. **Ease of Use and Accessibility:** Designed to be user-friendly, Artlas is accessible on various devices (web, desktop, mobile), making art more accessible to the general public, regardless of their location or familiarity with technology.

#### What type of audience is the Artlas solution intended for?

1. Creative Individuals: Individuals who create art, whether they are amateurs, enthusiasts, or aspiring artists. They use Artlas to share and potentially sell their artworks, benefiting from a platform that values and showcases their work.
2. Art Enthusiasts and Individual Collectors: This segment includes individuals who appreciate art and seek to purchase unique artworks for their personal collection, interior decoration, or as an investment.
3. General Public: Individuals from all backgrounds interested in discovering and appreciating art. This may include users who are not necessarily art connoisseurs but wish to explore and appreciate art in various forms.
4. Art and Culture Enthusiasts: People interested in various forms of art who use Artlas as a means to explore and engage with the artistic community, discovering new artworks and artists.
5. Social Media and Digital Platform Users: Individuals seeking to enrich their online experience with artistic and cultural content, finding in Artlas a new avenue for enriching social interactions around art.

#### Addressing Sustainable Challenges?

The sustainable challenges of the Artlas project are at multiple levels, including social, economic, cultural, and technological:

1. **Cultural Sustainability:**
    - **Promotion of Artistic Diversity:** Artlas can play a crucial role in preserving and promoting cultural diversity by giving visibility to artists from different communities, styles, and traditions.
    - **Education and Awareness:** By making art more accessible, Artlas has the potential to educate a wider audience about the importance of art in society and raise awareness of different forms of artistic expression.
2. **Social Sustainability:**
    - **Community Building:** Artlas can contribute to strengthening social bonds by connecting people with common artistic interests and creating communities around shared passions.
    - **Support for Emerging Artists:** By providing a platform for lesser-known or emerging artists, Artlas contributes to their professional and personal development.
3. **Economic Sustainability:**
    - **Creating New Economic Opportunities:** By enabling artists to sell their artworks directly through the platform, Artlas opens up new economic avenues for creators of all kinds.
4. **Technological Sustainability:**
    - **Adaptability and Scalability:** The platform must remain adaptable and scalable to incorporate new technologies and trends, ensuring its long-term relevance and sustainability. It will adapt to the works posted by the creators.
5. **Environmental Impact:**
    - **Reducing Carbon Footprint:** Unlike traditional art galleries, an online platform like Artlas can reduce the carbon footprint associated with art by reducing the need for physical travel.

In summary, Artlas has the potential to create a sustainable and positive impact on the art world by promoting cultural diversity, supporting the economic development of artists, strengthening social bonds, and adopting environmentally-friendly practices.

## Design

### Proposed Solution

The project is characterized by a **web application** developed with **React.js** and **Next.js**. The web application is accompanied by an **API** developed with **Node.js** and **Express.js**. The database used is **MongoDB**. Images are stored on an object storage service in a **Minio** bucket.

The web application is fully responsive and allows for easy navigation between different pages. It aims to provide a smooth and intuitive user experience, similar to popular social networks. Users can create an account, log in, access an art feed, like artwork, comment on artwork, share artwork, go to the artwork page, access an artist's page, follow an artist, save artwork to a list, and create a virtual gallery.

### Architecture

The **web application** and the **API** are two separate applications. The **API** is deployed on a dedicated server as a Docker container. The web application is also deployed in another container. The **API** can be accessed at the following address: <https://api.fournierfamily.ovh/>. The web application can be accessed at the following address: <https://fournierfamily.ovh/>.

The **web application** communicates with the **API** via **HTTP requests** whenever it needs an element. The **API** is secured with a **JWT token** system. The **API** then communicates with the **MongoDB** database to retrieve the necessary information. Images are stored on an object storage service in a **Minio** bucket.

CI/CD is managed by **GitHub Actions**. When a **push** is made to the **main** branch, tests are run. If the tests pass, the application is deployed to the production server. A staging server is also available to test new features before deploying them to the production server.

### Features

- Create an account
- Log in
- Access an art feed
- Like artwork
- Disucuss about artwork with its creator
- Share artwork
- Go to the artwork page
- Access an artist's page
- Follow an artist
- Save artwork to a list
- Create a virtual gallery

## Technologies Used

### Web Application

- TypeScript
- Node.js
- React.js
- Next.js
- Tailwind CSS
- Cypress
- Jest

### API

- JavaScript
- Node.js
- Express.js
- Multer
- NodeRSA
- JWT

### CI/CD

- GitHub Actions
- Docker

### Database

- MongoDB
- Minio (image storage)

### Hosting

- In-house dedicated server on UnraidOS
- Docker
- Nginx

## Installation

### Prerequisites

The application and its API are deployed on a server that we host. It can be accessed at the following address: <https://fournierfamily.ovh/>.

It is also possible to run the application locally. To do so, the following software needs to be installed:

- Node.js

### How to Install

- Clone the GitHub repository

```bash
git clone https://github.com/Artlas/web
```

- Install the necessary packages

```bash
npm install
```

- Launch the application

```bash
npm run dev
```

Open your browser and go to the following address: <http://localhost:3000/>.

## Screenshots

<!-- To be added at the end -->

## Contributors

- Adrien BLAIR [@Ahddry](https://github.com/Ahddry) (Front-end lead & server infrastructure )
- Aurélien BON [@Aurelien-Bon](https://github.com/Aurelien-Bon) (Node API lead & server infrastructure )
- Nicolas DREYFUS--LAQUIEZE [@Nicodl05](https://github.com/Nicodl05) (Back-end lead & testing lead)
- Cyril HAUBOIS [@teepol](https://github.com/teepol) (Node API & Back-end developer)
- Quentin LE BARON [@QuentinLbn](https://github.com/QuentinLbn) (Back-end, server & testing developer)
- Anna VALIDZHANOVA [@Jiuyhoi](https://github.com/Jiuyhoi) (Front-end & CI/CD developer)
