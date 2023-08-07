# Rental Manager

Rental Manager is a web application designed to assist landlords in efficiently managing their rental properties. With Rental Manager, landlords can easily add, organize, and access information about their properties, including addresses, rents, alerts, notes, and tenants. This application aims to streamline the property management process and provide a centralized platform for landlords to keep track of essential property-related data.

The web application is made in 2 parts, [Rental Manager](https://github.com/fotmjay/rentalmanager) and [Rental Backend](https://github.com/fotmjay/rentalbackend). Please also note that the dev branch is getting most of the commits, with only a few making it to the main branch.

Rental Manager is made essentially as a 1-page-app using React.
Rental Backend is made using NodeJS/Express and is simply a rest API serving data to the front-end (and managing authentification through JWT aswell as database access and Schemas).

Please ensure you have the following modules installed:

Front-end / Rental Manager

```
"nanoid": "^4.0.2",
"react": "^18.2.0",
"react-dom": "^18.2.0"

//dev
"@types/react": "^18.2.15",
"@types/react-dom": "^18.2.7",
"@vitejs/plugin-react-swc": "^3.3.2",
"eslint": "^8.45.0",
"eslint-plugin-react": "^7.32.2",
"eslint-plugin-react-hooks": "^4.6.0",
"eslint-plugin-react-refresh": "^0.4.3",
"vite": "^4.4.5"
```

Back-end / Rental Backend

```
"cors": "^2.8.5",
"dotenv": "^16.3.1",
"express": "^4.18.2",
"jsonwebtoken": "^9.0.1",
"mongodb": "^5.6.0",
"mongoose": "^7.3.1",
"morgan": "^1.10.0",
"validator": "^13.9.0"
//dev
"nodemon": "^3.0.1"
```

Clone the repositories:

```
git clone https://github.com/fotmjay/rentalmanager/
git clone https://github.com/fotmjay/rentalbackend/
```

Install the required modules for both:

```
npm install
```

Set up your credentials in the .env file. Replace DB_STRING with your actual MongoDB connection string, and SECRET_JWT_CODE with a secure key for JSON Web Token management:

```
DB_STRING = mongodb+srv://*****:*****@
SECRET_JWT_CODE= JWTSECRET
```

You will need to start the server (Rental Backend) and the front-end (Rental Manager) on 2 instances of your code editor as they both have to be "running" to use them. The front-end, unless compiled, runs through Vite. Backend runs on port 3000 (http://localhost:3000). Run the following on each instance of your editor:

```
npm run dev
```

Visit http://localhost:3000 in your web browser.
Sign up or log in as a landlord.
Use the intuitive user interface to add and manage your properties, rents, alerts, notes, and tenants.

### Current limitation: No way to create new accounts. Can use the one in the code for testing or wait for a further update that will be adding account creation through the API.

## App Features

**Property Management**

Add and store property information, including addresses, rental details and specifics.

**Rent Tracking**

Keep track of rent amounts, due dates, and payment statuses for each property.

**Alerts and Reminders**

Set and receive alerts for important events, such as lease expirations or maintenance tasks.

**Notes**

Jot down notes for each property and tenants to keep a record of relevant details or instructions.

**Tenant Information**

Manage tenant details, lease agreements, and contact information. Easily link tenants to their leased appartment.

## Planned Enhancements

**Calendar Integration**

Integrate with popular calendar platforms to sync important dates and reminders.

**Expense Tracking**

Implement expense tracking functionality to help landlords monitor property-related costs.

**Automated Rent Reminders**

Set up automated rent reminders to notify tenants of upcoming due dates.

**Reports and Analytics**

Generate reports and analytics to provide insights into property performance and financials.

## Difficulties encountered

**Managing React State:**

Handling state management in React components proved challenging, especially when dealing with nested components and data updates.

**Server as API-only:**

Transitioning from serving complete pages to using the server as an API for JSON messages required a paradigm shift in frontend and backend development.

**Frontend Technicalities:**

Overcoming various frontend technical challenges, such as responsive design, UI components, and form validation, demanded careful attention and implementation.

**Model Management:**

Effectively managing data models and interactions between frontend and backend components presented complexities in the development process.

## What I Learned

During the development of Rental Manager, I acquired valuable knowledge and experience in various areas:

**Using JWT for Authentication:**

I implemented JWT (JSON Web Tokens) for user authentication, enhancing security and user authorization.

**React.js:**

Rental Manager marked my first project using React.js, and I gained proficiency in building interactive and dynamic user interfaces.

**Server-side API Development:**

Developing the server as an API and handling JSON messages improved my understanding of RESTful API design and usage.

**Frontend and Backend Integration:**

I learned to seamlessly integrate frontend and backend components, ensuring smooth communication between the two.

**Asynchronous Programming:**

Handling asynchronous operations, such as API calls and database interactions, honed my skills in writing efficient and responsive code.

**Project Management:**

Through this project, I gained valuable experience in managing the development process, including planning, task allocation, and version control.
