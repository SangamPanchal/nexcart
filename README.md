# NexCart Backend API

A robust, scalable, and secure RESTful backend API for an e-commerce platform. Built with Spring Boot, this application handles user authentication, complex relational data mapping, and seamless third-party payment integration using Stripe.

---

## 🔗 Live Links

- **Frontend Deployment:** [https://nexcartfrontend.vercel.app](https://nexcartfrontend.vercel.app)
- **Backend API Base URL:** `http://137.23.46.99/api`

### Demo Credentials
- **Username:** `testuser`
- **Password:** `Password123!`

## Tech Stack

* **Core Framework:** Java (JDK 17+), Spring Boot 3
* **Database & ORM:** PostgreSQL, Spring Data JPA (Hibernate)
* **Security:** Spring Security (JWT / Session Management)
* **Payment Gateway:** Stripe Java SDK
* **Build Tool:** Maven

## Key Features

* **Secure Payment Processing:** Generates secure Stripe Checkout sessions, handles fiat currency conversions (INR to Paise), and securely manages transactional states.
* **Relational Database Management:** Utilizes PostgreSQL for structured data storage with automated schema generation via Hibernate.
* **Robust Security:** Implements Spring Security to protect endpoints, manage user authentication, and ensure data integrity.
* **Environment Isolation:** Employs industry-standard environment variable injection to keep sensitive database credentials and API keys completely isolated from the source code.

## Prerequisites

Ensure you have the following installed on your local machine before running the application:
* Java Development Kit (JDK) 17 or higher
* Apache Maven
* PostgreSQL (running locally on port `5432`)
* A [Stripe Developer Account](https://dashboard.stripe.com/test/apikeys) (for generating test API keys)

## Configuration

This project enforces strict security practices by relying on environment variables for sensitive data.

**1. Create the Database**
Ensure your local PostgreSQL server is running and create a blank database named `nexcart_db`.

**2. Configure Environment Variables**
Create a `.env` file in the root directory of the project (alongside `pom.xml`) and add your secure credentials:

```env
DB_URL=jdbc:postgresql://localhost:5432/nexcart_db
DB_USERNAME=postgres
DB_PASSWORD=your_super_secret_password
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key```


