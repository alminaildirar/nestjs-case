# 🎥 MOVIE API

## 🗒️ Overview

This NestJS-based application provides a service for fetching and storing movie data from an external API (The Movie Database - TMDB).  This app performs CRUD  operations on the database. The fetched data is stored in a MongoDB database. To ensure data consistency and up-to-date information, the database is updated every night with the latest movie data with cron job.

📄 [Checkout API Document (Swagger)](https://my-nestjs-app-8bba31dd90ed.herokuapp.com/api)

🪀 [Checkout GraphQL Playground](https://my-nestjs-app-8bba31dd90ed.herokuapp.com/graphql)

---

### ⚙️ **Setup and Running**

**Step 1: Clone the Repository**

```bash
git clone https://github.com/username/my-nestjs-project.git
cd my-nestjs-project
```

**Step 2: Install Dependencies**

```bash
npm install
```

**Step 3: Set Up Environment Variables**

```bash
PORT=your_port_number
TMDB_API_KEY=your_tmdb_api_key
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/

```

**Step 5: Start the Application**

```bash
npm run start:dev
```

---

## 🖇️ Project Layers

### **1. HTTP Client Service**

**Location: `src/common/http-client.service.ts`**

The HTTP Client Service is responsible for managing communication with external APIs (e.g., TMDB API). It uses axios for handling HTTP requests and RxJS for managing asynchronous data flows.

**Key Features:**

- Secure and manageable communication with external APIs.
- Supports various HTTP methods such as GET, POST, PUT, DELETE.
- Includes error handling and retry mechanisms to ensure reliability.

### **2. Repository Service**

**Location: `src/movies/movie.repository.ts`**

The Repository Service is responsible for direct communication with the database, ensuring data persistence. It interacts with MongoDB using Mongoose.

**Key Features:**

- Stores, updates, deletes, and queries movie data.
- Abstracts database operations to provide a clean interface for other layers.

### **3. Movies Service**

**Location: `src/movies/movies.service.ts`**

The Movies Service contains the core business logic of the application. It coordinates database operations and external API calls using the Repository Service and HTTP Client Service.

**Key Features:**

- Contains business logic and data transformations.
- Coordinates database operations and external API calls.
- Processes data according to user requests and business requirements.

### **4. Controllers**

**Location: `src/movies/movies.controller.ts`**

Controllers handle user requests and direct them to the appropriate services. They are responsible for receiving HTTP requests and returning appropriate responses.

**Key Features:**

- Manages HTTP requests.
- Validates incoming requests and directs them to the appropriate service for processing.
- Returns HTTP responses based on the service output.

---

### ❗Persist Data Info

To ensure data consistency and up-to-date information, the database is updated every night with the latest movie data. Specifically, a scheduled task (cron job) runs every night to update the database with the following criteria:

- **5 Movies with the Oldest Release Date:** Sorted by **`release_date.asc`**
- **Minimum Vote Count:** At least 1500 votes (**`vote_count_gte: 1500`**)
- **Minimum Average Vote:** At least 8.4 (**`vote_average_gte: 8.4`**)
- **Available on Netflix Platform:** (**`watch_provider_id: 8`**)
- **Available in Turkey:** (**`watch_region: TR`**)

These filtered movies are persisted in the database, and all CRUD operations in the application are performed on this data set. (If you want, you can change filters in tmdb-api.service )

---

### 📄 API Documentation

| Method | URL | Description | Parameters | Request Body |
| --- | --- | --- | --- | --- |
| GET | /movies | Retrieves a list of all movies | None | None |
| GET | /movies/:id | Retrieves a movie by ID | id (string): The ID of the movie to retrieve | None |
| POST | /movies | Create or update a movie | None | {"name":"string", "overview": "string", "releaseDate":"string", "popularity": "number", "voteAverage":"number", "voteCount": "number", "genres": [ { "id": "number" "name": "string" } ] } |
| DELETE | /movies/:id | Deletes a movie by ID | id (string): The ID of the movie to delete | None |

---

### 📄 **GraphQL API Documentation**

### **Schema**

The GraphQL schema defines the structure of the API and the types available. The following types and queries are defined:

```graphql
type Movie {
  id: String!
  name: String!
  overview: String!
  popularity: Float
  voteAverage: Float
  voteCount: Int
  releaseDate: String!
  genres: [Genre]
}

type Genre {
  id: Int!
  name: String!
}

type Query {
  movie(id: String!): Movie
}

```

**Query**  
• **movie(id: String!):** Returns a single movie by ID.

```graphql
query {
  findById(id: "424") {
    id
    name
    overview
    popularity
    voteAverage
    voteCount
    releaseDate
    genres {
      id
      name
    }
  }
}
```

```graphql
{
  "data": {
    "findById": {
      "id": "424",
      "name": "Schindler's List",
      "overview": "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.",
      "popularity": 105.677,
      "voteAverage": 8.568,
      "voteCount": 15371,
      "releaseDate": "1993-12-15",
      "genres": [
        {
          "id": 18,
          "name": "Drama"
        },
        {
          "id": 36,
          "name": "History"
        },
        {
          "id": 10752,
          "name": "War"
        }
      ]
    }
  }
}
```

---

### 📂 Directory Structure

```lua
├── src
│   ├── common
│   │   ├── filters
│   │   │   ├── graphql-exception.filter.ts  # Filter for handling GraphQL exceptions
│   │   │   └── http-exception.filter.ts     # Filter for handling HTTP exceptions
│   │   ├── http-client
│   │   │   ├── http-client.module.ts        # Module for HTTP client
│   │   │   └── http-client.service.ts       # Service for HTTP client
│   │   ├── interceptors
│   │   │   └── response.interceptor.ts      # Interceptor for modifying responses
│   ├── config
│   │   ├── configuration.module.ts          # Module for configuration
│   │   ├── configuration.service.ts         # Service for configuration
│   │   └── mongoose.config.ts               # Configuration for Mongoose (MongoDB)
│   ├── graphql
│   │   ├── graphql.module.ts                # Module for GraphQL
│   │   ├── graphql.ts                       # GraphQL configuration
│   │   ├── movie.model.ts                   # GraphQL model for Movie
│   │   └── movie.resolver.ts                # Resolver for GraphQL movie queries and mutations
│   │   └── schema.gql                       # GraphQL schema definition
│   ├── movies
│   │   ├── controller
│   │   │   └── movies.controller.ts         # Controller for handling movie-related HTTP requests
│   │   ├── dto
│   │   │   └── movie-create.dto.ts          # DTO for creating movies
│   │   ├── interfaces
│   │   │   ├── tmdb-movie-detail-response.ts # Interface for TMDB movie detail response
│   │   │   └── tmdb-movies-response.ts      # Interface for TMDB movies response
│   │   ├── mappers
│   │   │   └── movie.mapper.ts              # Mapper for transforming movie data
│   │   ├── models
│   │   │   └── movie.model.ts               # Mongoose schema for Movie
│   │   ├── repository
│   │   │   └── movie.repository.ts          # Repository for accessing movie data in the database
│   │   ├── services
│   │   │   └── movies.module.ts             # Module for movie-related services
│   ├── tasks
│   │   ├── tasks.module.ts                  # Module for scheduled tasks
│   │   └── tasks.service.ts                 # Service for handling scheduled tasks
│   ├── app.controller.ts                    # Main application controller
│   ├── app.module.ts                        # Main application module
│   ├── main.ts                              # Entry point of the application
├── .env                                     # Environment variables file
├── Dockerfile                               # Dockerfile for building the Docker image
├── package.json                             # NPM package configuration
├── README.md                                # Project documentation
```