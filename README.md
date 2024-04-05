# PTO Requests

## Overview

This project is a web application built with Next.js, a popular open-source React framework, allowing for server-side rendering and easy deployment. The application includes security measures such as hashing and salting passwords using bcrypt-ts and preventing SQL injection with Next.js.

## The Objective
The Objective of the project was to build a secure web facing application for the sponsors need of automated pto requests.

## Deployment with Vercel

This project utilizes Vercel for deployment automation. Vercel simplifies the deployment process by automatically detecting Next.js projects and configuring deployment settings accordingly. Follow the steps below to deploy the application:

1. Sign up for a Vercel account if you haven't already: [Vercel Signup](https://vercel.com/signup).
2. Connect your GitHub, GitLab, Bitbucket, or other repository containing the project code to Vercel.
3. Configure deployment settings, such as environment variables and custom domains, as needed.
4. Vercel will automatically deploy the application upon code changes, ensuring seamless updates.

## Security Measures

### Hashed & Salted Passwords

User passwords are securely hashed and salted using bcrypt-ts before being stored in the database. This ensures that even if the database is compromised, passwords remain protected.

### Prevention of SQL Injection (SQLi)

Next.js provides built-in protections against common web vulnerabilities like SQL injection. By utilizing server-side rendering (SSR) or static site generation (SSG), Next.js safely handles user input and prevents SQL injection attacks.

## Next.js Overview

Next.js is an open-source React framework that simplifies the development of server-side rendered (SSR) React applications. It offers features such as automatic code splitting, client-side routing, and more, out of the box.

## End Goals

The end goals of this project include setting up the following functionalities:

### Dashboard Setup

- View your Paid Time Off (PTO) hours.
- Access a list of employees with their respective roles.

### Schedule Page Setup

- View the work schedule for the week.

### PTO Page Setup

- Request PTO.
- View PTO requests.

These functionalities aim to provide users with a comprehensive platform to manage their PTO, access work schedules, and facilitate PTO requests efficiently.


## Setup

Follow these steps to set up the web application locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/juliosantamariafgcu/Underscores_Group_7

2. Open project folder in terminal:                                                                                  
   nextjs-dashboard
3. in terminal type
   ````
   npm i
   npm run dev
   npm ci
4. The application can now be run locally in web browser
````
http://localhost:3000

