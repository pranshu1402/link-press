## About LinkPress

LinkPress is a system that enables users to convert long URLs into short aliases. When these aliases are used, they redirects to the original long URLs along with time of expiry. Additionally, the system should provide analytics for each short link, including the number of visits.
Project is created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).

## How to run project
### Steps to run locally:
- Clone git repo
- Make sure to have node version > 16.0
- Install all npm dependencies using `npm i`
- Run the server in development mode: `npm run dev`

### `npm run build`
Build the project for production.

### `npm start`
Run the production build (Must be built first).


## Available APIS

### Auth:

- Login: "/login"
- Logout: "/logout"

### Users:

- Register: "/register" (Sign Up a new user in system)
- Delete: "/delete/:id" (Soft delete a user from db)

### Link:

- Redirect: "/:id" (redirects short url to long url if found, otherwise to page not found)
- Shorten: "/shorten" (generates a short url from provided long url)
- Reactivate: "/re-activate/:id" (reactivate short url for long url if expired)
- GetAllByUser: "/user" (Fetches all short link details generated by logged in user)

## Database Schema

Link {
\_id?: string | ObjectId;
indexId: number;
shortUrl: string;
longUrl: string;
clickCount: number;
failedViews: number;
expireBy: Date;
deleted?: boolean;
createdAt?: Date;
createdBy: string | ObjectId; (Linked to User collection)
updatedAt?: Date;
}

User {
\_id?: string;
name: string;
email: string;
pwdHash?: string;
role?: UserRoles;
}