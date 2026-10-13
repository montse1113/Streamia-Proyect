# Streamia — Sprint 1 Planning

Oct 12, 2026 · @Cristofer

## About the project

Streamia is a streaming web app, like a small Netflix. Users sign up, pick a subscription plan, pay, and then they can watch movies and series. Without an active subscription they can browse the catalog but not play anything.

| Member | ID | What they work on |
| --- | --- | --- |
| Cristofer Guadalupe Herrera Ramírez | 232929 | Backend, database, subscriptions and payments |
| Andrea Montserrat Ramírez Martínez | 549812 | Frontend, catalog, favorites, video player and admin panel |

Repository: [Streamia-Proyect](https://github.com/montse1113/Streamia-Proyect)

We are using what we have seen in class: Node.js, Express and TypeScript for the backend, MySQL with Sequelize for the database, and React for the frontend. Payments use Stripe in test mode, so no real money is charged.

## Requirements

### Functional

| The system must… | Priority |
| --- | --- |
| Let a visitor sign up with name, email and password | Critical |
| Let a user log in and log out | Critical |
| Let a user see and edit their profile | Medium |
| Show the subscription plans to anyone | High |
| Let a user pay for a plan with Stripe (test mode) | Critical |
| Activate, renew or cancel the subscription when Stripe confirms it | Critical |
| Let a user cancel their subscription and see their payments | Medium |
| Show the catalog of movies and series, filtered by genre and type | Critical |
| Let a user search titles by name | High |
| Show a title's details: synopsis, year, age rating, seasons and episodes | High |
| Let a user add and remove titles from their favorites | Medium |
| Let only users with an active subscription play videos, and remember where they stopped | Critical |
| Let the admin add, edit and deactivate titles, seasons, episodes, genres and plans | High |
| Let the admin see the users and their subscription status | Low |

### Non-functional

- Passwords are saved encrypted with bcrypt, never as plain text.
- The server validates all the data it receives.
- The API answers with the correct HTTP status codes (200, 201, 400, 401, 403, 404, 409, 500).
- Passwords and keys (database, JWT, Stripe) go in `.env`, never in the repository.
- The backend is split into routes, middlewares, controllers and models.
- The site works on phones and computers.

## Use cases

The system has four actors: the **visitor** (not logged in), the **user** (logged in, with or without a subscription), the **admin**, and **Stripe**, which tells our server when a payment goes through.

| Use case | Actor | Result |
| --- | --- | --- |
| Sign up | Visitor | A new account is created |
| Log in | Visitor | The user enters the app |
| See plans | Visitor, user | The list of plans is shown |
| Subscribe to a plan | User | The user is sent to the Stripe payment page |
| Confirm payment | Stripe | The subscription becomes active |
| Cancel subscription | User | The subscription is canceled at the end of the month |
| Browse and search the catalog | User | The matching titles are shown |
| See title details | User | The synopsis, seasons and episodes are shown |
| Manage favorites | User | A title is added or removed from My List |
| Play a video | User | The video plays and the progress is saved |
| Manage content | Admin | Titles, seasons and episodes are updated |
| Manage plans | Admin | Plans are created or deactivated |

If a user tries to play a video without an active subscription, the app sends them to the plans page instead.

## Entity-relationship model

The ER diagram is in `docs/er-diagram.png`. It has 11 tables, and each box shows the column name, its data type and, in red, the type of key.

The tables are organized in three groups:

- **Users and payments:** `users`, `plans`, `subscriptions` and `payments`. A user can have many subscriptions over time, each subscription uses one plan, and each payment belongs to a subscription.
- **Catalog:** `titles`, `genres`, `title_genres`, `seasons` and `episodes`. A title can be a movie or a series; a series has seasons, and each season has episodes. `title_genres` connects titles and genres, because a title can have many genres and a genre can have many titles.
- **User activity:** `favorites` and `watch_progress`. They save the user's list and where they stopped watching each title or episode.

What the red letters mean:

| Letters | Name | Meaning |
| --- | --- | --- |
| PK | Primary key | The column that identifies each row; it never repeats (usually `id`) |
| FK | Foreign key | A column that points to the `id` of another table; it is what connects the tables |
| UK | Unique key | A column that cannot repeat, but is not the primary key (for example, `email`) |
| PK, FK | Both | In `favorites` and `title_genres`, the two columns together are the primary key, and each one also points to another table |

The lines show how tables are related. The end with three little lines (crow's foot) is the "many" side; for example, one user **has** many subscriptions.

## How we will organize the backend

We will split the backend into four parts, like in the class project:

- **Routes:** receive the requests from the frontend.
- **Middlewares:** check if the user can continue (if they are logged in, if they are admin, if they have an active subscription).
- **Controllers:** do what each route needs.
- **Models:** save and read data from the database.

Some of the routes we are planning:

| Route | What it does | Who can use it |
| --- | --- | --- |
| `POST /auth/register` | Create an account | Anyone |
| `POST /auth/login` | Log in | Anyone |
| `GET /titles` | See the catalog | Logged-in users |
| `POST /subscriptions/checkout` | Pay for a plan | Logged-in users |
| `GET /playback/:id` | Play a video | Users with an active subscription |
| `POST /admin/titles` | Add a title | Admin only |

## User stories

The stories are grouped into 5 epics, the same way as on our GitHub board. Each one has its priority, its owner and its acceptance criteria.

### Epic 1 — Identity and access

**US-001 Sign up** · Critical · Cristofer As a visitor, I want to create an account with my email and password, so that I can use Streamia.

- If the data is correct, the account is created and the response does not include the password.
- If the email is already registered, I get an error (409).
- If the password has fewer than 8 characters or no number, I get an error (400).
- The password is saved encrypted with bcrypt.

**US-002 Log in** · Critical · Cristofer As a user, I want to log in, so that I can enter the catalog.

- With the right email and password, I get a token that lasts 1 hour.
- With wrong data, I get an error (401) that does not say whether the email exists.

**US-003 Roles** · High · Cristofer As an admin, I want only admins to enter the admin panel, so that nobody else can change the content.

- Without logging in, protected pages give an error (401).
- A normal user trying to enter the admin panel gets an error (403).

### Epic 2 — Subscriptions and payments

**US-004 See plans** · High · Andrea As a visitor, I want to see the plans and their prices, so that I can choose one.

- Each plan shows its name, monthly price in pesos, video quality and number of screens.

**US-005 Pay for a plan** · Critical · Cristofer As a user, I want to pay for a plan, so that I can watch content.

- When I choose a plan, I am sent to the Stripe payment page.
- The price comes from our database, not from the browser.
- If I already have an active subscription, I cannot pay for another one (409).

**US-006 Payment confirmation** · Critical · Cristofer As the system, I want to receive Stripe's confirmation, so that the subscription is activated.

- The subscription only becomes active when Stripe confirms the payment.
- A fake message (bad signature) is rejected (400).
- If Stripe sends the same confirmation twice, the payment is only saved once.

**US-007 Cancel and see payments** · Medium · Cristofer As a user, I want to cancel and see my payments, so that I can control what I spend.

- When I cancel, I can still watch until the month I paid for ends.
- I can only see my own payments.

### Epic 3 — Catalog and search

**US-008 Browse the catalog** · Critical · Andrea As a user, I want to see the titles by genre, so that I can find something to watch.

- The catalog shows 15 titles per page and can be filtered by movie/series and by genre.

**US-009 Search** · High · Andrea As a user, I want to search by name, so that I can find a title quickly.

- The search ignores capital letters and accents.
- If nothing matches, it shows a "no results" message.
- The search is safe against SQL injection: typing `' OR 1=1 --` returns no results instead of an error.

**US-010 Title details** · High · Andrea As a user, I want to see a title's synopsis, year, age rating and episodes, so that I can decide if I want to watch it.

- If the title does not exist, the "not found" page is shown (404).

### Epic 4 — Playback and favorites

**US-011 Play a video** · Critical · Andrea As a user with an active subscription, I want to play a title and continue where I left it.

- Without an active subscription, I cannot play it and I am sent to the plans page (403).
- The app saves where I stopped.

**US-012 Favorites** · Medium · Andrea As a user, I want to save titles in My List, so that I can watch them later.

- I cannot add the same title twice.
- I only see my own list.

### Epic 5 — Admin

**US-013 Manage content** · High · Andrea and Cristofer As an admin, I want to add, edit and deactivate titles, seasons and episodes.

- A deactivated title disappears from the catalog but is not deleted from the database.

## Sprint goals

| Sprint | Review | Goal | Stories |
| --- | --- | --- | --- |
| 1 — Planning | Oct 13 | Have the planning done and the repository organized | — |
| 2 — First features | Oct 27 | Sign up, log in and catalog working with the database | US-001, 002, 003, 008, 010 |
| 3 — Payments and playback | Nov 10 | Plans, Stripe payments and video playback | US-004, 005, 006, 011 |
| 4 — Finish | Nov 24 | Search, favorites, cancel and admin panel | US-007, 009, 012, 013 |
| Final | Dec 11 | Deliver and present the project | — |

## Security requirements

### Planned validations

- The server checks every piece of data it receives (email format, password length, required fields) and answers 400 if something is wrong.
- SQL queries always use parameters (`?`), never text pasted directly into the query.
- Stripe confirmations are only accepted if their signature is valid.

### Access by role

| Who | What they can do |
| --- | --- |
| Visitor | Sign up, log in and see the plans |
| User | Browse the catalog, manage favorites and pay for a plan |
| User with an active subscription | Everything above, plus play videos |
| Admin | Everything above, plus manage content and plans |

The user id is always taken from the token, so nobody can see or change another user's data.

### Protecting secrets

- Passwords are saved with bcrypt and are never sent back in a response.
- Database, JWT and Stripe keys go in `.env`, which is in `.gitignore`.
- The repository only has `.env.example`, with the variable names but no values.

### Security test cases

| ID | Test | Expected result |
| --- | --- | --- |
| ST-01 | Open favorites without logging in | 401 |
| ST-02 | A normal user tries to add a title in the admin panel | 403 |
| ST-03 | Play a video with an expired subscription | 403 |
| ST-04 | Sign up with an email that already exists | 409 |
| ST-05 | Search for `' OR 1=1 --` | Empty list, no SQL error |
| ST-06 | Send a fake Stripe confirmation | 400, the subscription does not change |
| ST-07 | Check the response of the profile route | It does not include the password |
| ST-08 | Ask for another user's payments | Only your own payments are shown |

## GitHub and Gitflow

Our tasks are on a GitHub Project board with the columns Icebox, Backlog, In progress, Testing and Done. Each epic, user story and technical task is an issue with its owner.

| Branch | What it is for |
| --- | --- |
| `main` | The stable version delivered at the end of each sprint |
| `develop` | Where we join our finished work |
| `feature/...` | One branch for each story or task |
| `release/...` and `hotfix/...` | Preparing a delivery or fixing an urgent bug |

Nobody pushes directly to `main` or `develop`. Every change goes through a pull request that the other teammate reviews and approves.
