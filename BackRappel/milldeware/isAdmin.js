Jump to Comments
Save

Cover image for Build a Login and Logout API using Express.js (Node.js)
Joshua M
Joshua M
Posted on Mar 15, 2023 • Updated on Nov 30, 2023

Build a Login and Logout API using Express.js (Node.js)
#
api
#
javascript
#
node
#
beginners
Table of contents
Introduction
The Concept of Authentication and Authorization
Authentication
Authorization
Setting up the development files, installing required packages, and creating a database
Creating Main Route and API server instance
Create a Main route
Create a server instance for your API
Authentication Logic
Authorization Logic
Logout Logic
Introduction
One of the first challenges I encountered when I started writing server code was how to build a secured yet simple authentication and authorization (AA) flow without dependence on third-party providers. Thank God for the tech community and platform such as StackOverflow from where I got better explanations.

Note that there are better technologies to use when it comes to implementing an AA system in your app. Nowadays, you don't have to write AA code yourself, allowing you to focus on the business logic of your app.

In this article, you will learn the basics of authentication and authorization, and how to build a login and logout system using ExpressJS. I have chosen ExpressJS for this tutorial because it is flexible and has an easy learning curve.

Prerequisites:

Basic knowledge of Backend development in Node (ExpressJS)
Basic knowledge of NOSQL - Mongoose or MongoDB
Basic knowledge of JSON Web Tokens (JWT)
Basic knowledge of how cookies work
Clone the project repository - https://github.com/mjosh51/authentication-authorization-expressjs-tutorial-starterfiles (optional)

Before we dive into writing codes, let’s review some theories. Doesn’t sound good to you? Yes, I am a fan of practicals too. However, let’s define a few concepts.

The Concept of Authentication and Authorization
In this section, you will briefly get to know what Authentication and Authorization is, and their difference.

Authentication

Authentication is the process of verifying a user’s identity. Essentially, it means making sure that a user is who they say they are.

You can use one or more of the following methods while implementing authentication:

What a person knows (password or passphrase).
What a person has (one-time token or physical device).
What a person is (biometrics, fingerprint reader, facial recognition).
Authorization

Authorization follows authentication. It ensures that a logged-in user has the right to perform specific actions or view certain data. For example, a user may have access to view his personal information through a web interface, but shouldn’t be permitted to view other user’s data. He also shouldn’t have access to administrative functions if he is just a regular user. In cases where a user was able to access another user’s account either by changing parameters or ID, then there is a flaw in the authentication/authorization flow. You can read more here https://learn.microsoft.com/en-us/aspnet/web-api/overview/security/authentication-and-authorization-in-aspnet-web-api

Now, that’s enough theory to get us started.

Setting up the development files, installing required packages, and creating a database.
Here, you will set up your development files, install dependencies and create a Mongo database.

You may skip Step One and Two if you already cloned the starter files from https://github.com/mjosh51/authentication-authorization-expressjs-tutorial-starterfiles, instead, in your project's folder terminal, type npm i to install the required packages.

Step One

Create a folder for your project and open it using your favourite code editor. For this tutorial, I will be using VSCode.
In your terminal, enter npm init. (Assuming you have node installed on your machine)
Respond appropriately to the prompts.
Create a folder in the root of your project folder, name it "v1". Note that this is optional. It just helps to organize the versions of your app. Other names you can use are "app", and "src"...
Inside your package.json file, under "scripts", add a dev and/or start command to enable you to start your API.
Add "dev": "nodemon v1/server.js", under "scripts" in your package.json file
Add "type": "modules" to your package.json file, to use import statements rather than require.
Step Two
Installing required packages: In your project directory terminal, enter,

npm install express mongoose bcrypt cookie-parser dotenv cors express-validator jsonwebtoken
npm install --save-dev nodemon. (To install Nodemon as dev dependency)
Now you have installed the necessary tools for this tutorial.

A quick explanation of some of the tools you just installed

ExpressJS is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. https://expressjs.com
Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB. https://mongoosejs.com/docs/index.html
Bcrypt is a library to help you hash passwords. It uses a password-hashing function that is based on the Blowfish cipher. We will use this to hash sensitive things like passwords.
Cookie-parser is a middleware used to parse the Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.
Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options. We don’t necessarily need this as we are developing just the API, however, good that you know in case you want to implement one.
Express-Validator is a set of express.js middlewares that wraps validator.js validator and sanitiser functions. You may want to check for an empty request body or validate or even sanitize the request body. This package is very useful for that. You will add one or two of its functions in your code later.
Nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected. With this, you don’t have to manually restart your application each time you make changes. Another powerful tool used mostly in production is pm2. You can check it out pm2.
Step Three
Get your URI string from MongoDB or your database of choice. In this particular tutorial, I am using Mongoose.

Create an account on MongoDB.
Create a database.
Once you have done that, it should look like this,

Database created

Click connect
Copy the connection string into your .env file as the value for URI.
Now, get set to code.

Creating Main Route and API server instance
In this section, you will create a route for the main app and other mini apps. Here think of an app as a route. This means that your API will have a main route which routes other mini-routes.

A route is a part of your code that handles an HTTP request e.g. GET, POST, DELETE, PUT, and the associated function. The home route is like a welcome page for your API. As you might have known, an API is the middleman between a client app and the database.

Create a Main route
To create a main route:

Create a folder named "routes" in your v1 folder
Create a file inside your routes’ folder, name it "index.js" (without the quotes)
Import the express module
Create an app object of the express app instance
Call the get method on the app object, and write the function handler.
Export the app object as the default
Check the GitHub repository for the starter files to confirm that you have the same number of folders. Note: You may ignore the utils folder for now.

Your code should look like the following:

File Path - v1/routes/index.js
import express from "express"; // import the express module

const app = express(); // Create an app object

app.disable("x-powered-by"); // Reduce fingerprinting (optional)
// home route with the get method and a handler
app.get("/v1", (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            data: [],
            message: "Welcome to our API homepage!",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
});
export default app;
Note that, in the preceding code, we have used express() to create the main app object for the main route. For other mini-routes, we will use express.Router() instead. You shall see that soon.

Create an env and configuration file

Another important file to create is the env file. The env file stores a key-value string for your secret strings which you would not want to be exposed. You may store API keys, secrets, and tokens in it.

Run the command npm run env to create an env file with the .env.example file template in the starter files.

Otherwise,

Create a new file in your project's root folder and name it ".env".
Copy and paste the following into it
#DATABASE_STRING
URI=xxxxxxx
#SERVER_PORT
PORT=5005
#TOKEN
SECRET_ACCESS_TOKEN=xxxxx
You will change some of the values later.

You may also create a configuration file or config file for short. It is used to organize environment variables into one place for convenient usage.

To do that,

Create a folder inside your v1 folder, name it "config"
Create a file named "index.js" inside the folder created previously
Import the dotenv module, and call the config method on it
Destructure environment variables by their keys
Export the destructured variables
Your file should look like,

File Path - v1/config/index.js
import * as dotenv from "dotenv";
dotenv.config();

const { URI, PORT, SECRET_ACCESS_TOKEN } = process.env;

export { URI, PORT, SECRET_ACCESS_TOKEN };
Create a server instance for your API
To keep things simple, we will create a server instance for the main app.

Create a file named "server.js" inside your v1 folder
Import express, cors, cookieParser, mongoose modules
Import port and database string variable from the config file you created earlier (Note: the file is a named export)
Import the Main app route from routes/index.js
Create a server object e.g const server = express()
Configure Server Header
Connect Database
Connect the main route to the server
Start up server
Compare your code with the following code:

File Path - v1/server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { PORT, URI } from "./config/index.js";
import App from "./routes/index.js";

// === 1 - CREATE SERVER ===
const server = express();

// CONFIGURE HEADER INFORMATION
// Allow request from any source. In real production, this should be limited to allowed origins only
server.use(cors());
server.disable("x-powered-by"); //Reduce fingerprinting
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// === 2 - CONNECT DATABASE ===
// Set up mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log("Connected to database"))
    .catch((err) => console.log(err));

// === 4 - CONFIGURE ROUTES ===
// Connect Main route to server
server.use(App);

// === 5 - START UP SERVER ===
server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
It is time to start your API for testing. First, inside your terminal, run this command - npm run dev. Your server should be started like so,

server started

Using Postman or your favourite API testing platform, send a GET request to http://localhost:5005/v1. I am using the REST Client extension for VSCode. If everything goes well, you should get a similar response like,

Server homepage

Authentication Logic
In this part of the code, you will be writing functions and routes for user authentication and input validation.

To do that, you will complete a few tasks, which are:

Create a user model for your API
Create an Input validation for your API
Create an authentication controller and routes for your API
Create a Registration logic
Add a Registration route
Create a Simple Login logic
Add a Login route
Add Session to Login logic
A controller is a logic that handles a particular task. The router receives a request and executes the controller logic associated with it.

Create a user model
First, you have to create your user model or schema. This schema defines a user profile that is stored in the database.

To create a schema,

Create a folder named "models" in your v1 folder
Inside the models' folder, create a file with the name "User.js"
Copy the following code into it,
File Path - v1/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: "Your firstname is required",
            max: 25,
        },
        last_name: {
            type: String,
            required: "Your lastname is required",
            max: 25,
        },
        email: {
            type: String,
            required: "Your email is required",
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: "Your password is required",
            select: false,
            max: 25,
        },
        role: {
            type: String,
            required: true,
            default: "0x01",
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

export default mongoose.model("users", UserSchema);
With this, you have a user model and a function that hashes the user’s password during registration or any modification before saving it into the database. You don't want to save plain passwords into the database. Note that, in the preceding code block, we have added a default role to every user that registers on the app. We will manually change a user to an admin by editing the role code later in this article.

Next, let's write a function to validate user inputs.

Create an Input validation
It is important to validate user input for any incorrect information or malicious attempts. To confirm that users supply the right information,

Create a folder named "middleware" inside your v1 folder. A middleware is a handler that has access to the request and response object. It can be used to modify requests or responses.
Create a "validate.js" file inside the middleware folder
Import validationResult from express-validator. The validationResult returns an array of errors, if any.
Write a function that validates the request object and returns an array of errors.
Your code should be similar to the following:

File Path - v1/middleware/validate.js
import { validationResult } from "express-validator";

const Validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = {};
        errors.array().map((err) => (error[err.param] = err.msg));
        return res.status(422).json({ error });
    }
    next();
};
export default Validate;
Create an authentication controller and routes
You will create authentication (auth) logic for both registration and login and routes for them.

Create a Registration logic

To create an auth logic that handles user registration, complete the following tasks,

Create a folder with the name "controllers" in your v1 folder
Create a file named "auth.js" inside the controllers folder
Import the User model
Write a Register function that accepts the request and response objects
Destructure the HTTP request body to get user-supplied information such as email, password, first name, last name, etc.
Inside a try-and-catch block, create a user instance with the request's body information
Check if the email supplied already exists in the database. If it exists, send back a message to the client notifying it of the error. Otherwise, save the new user into the database and send the appropriate server response.
Your code should be similar to the following,

File Path - v1/controllers/auth.js
import User from "../models/User.js";

/**
 * @route POST v1/auth/register
 * @desc Registers a user
 * @access Public
 */
export async function Register(req, res) {
    // get required variables from request body
    // using es6 object destructing
    const { first_name, last_name, email, password } = req.body;
    try {
        // create an instance of a user
        const newUser = new User({
            first_name,
            last_name,
            email,
            password,
        });
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });
        const savedUser = await newUser.save(); // save new user into the database
        const { role, ...user_data } = savedUser._doc;
        res.status(200).json({
            status: "success",
            data: [user_data],
            message:
                "Thank you for registering with us. Your account has been successfully created.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    res.end();
}
So simple right? Yes, that’s it.

Head to your routes folder, you need to include a route for the authentication logic.

Add a Registration route

Inside your routes folder, create another file called "auth.js"
Import express module
Import the Register logic from "controllers/auth.js"
Import check function from express-validator
Import the Validate function from middleware
Write the register route with a POST method and a "/register" path. Note that since we want to get user input and save it into the database, we will use the POST method. Learn more about HTTP request methods. You may want to know the difference between POST and PUT method
Validate input using the check and Validate functions
Export router as the default
Compare your code with the following:

File Path - v1/routes/auth.js
import express from "express";
import { Register } from "../controllers/auth.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";

const router = express.Router();

// Register route -- POST request
router.post(
    "/register",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("first_name")
        .not()
        .isEmpty()
        .withMessage("You first name is required")
        .trim()
        .escape(),
    check("last_name")
        .not()
        .isEmpty()
        .withMessage("You last name is required")
        .trim()
        .escape(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 chars long"),
    Validate,
    Register
);

export default router;
Now, head to your routes folder one more time, and inside the index.js file, do the following,

Import the Auth route
import Auth from './auth.js';

Call the use() method on the app object and pass a defined route path
app.use('/v1/auth', Auth);

Send a POST request with email, first name, last name, and password to http://localhost:5005/v1/auth/register
signup response

Your API has successfully registered a user. If you don’t want to return the password, you could adjust your auth.js file (controller) like so,

File Path - v1/controllers/auth.js
...
const savedUser = await newUser.save(); // save new user into the database
    const { password, role, ...user_data } = savedUser; // Return user's details but password
    res.status(200).json({
      status: 'success',
      data: [user_data],
      message:
        'Thank you for registering with us. Your account has been successfully created.',
    });
...
Next, you will learn how to write the login logic for your app.

Create a Simple Login logic

To create an auth for user login, do the following,

Navigate to the "auth.js" file inside your controllers' folder
Import bcrypt package (this will be used to compare the user's supplied password on login to the one you have associated with the user's email in your database)
Write a function that first checks if the email from the request body can be found in your database. If not, return a message clearly stating the error. Otherwise, continue to validate the password, by comparing the password from the request body to the stored password. If the result is not valid, return an error accordingly, else, return a message telling the user, that the login was successful.
Now, compare your code with the following code block.

File Path - v1/controllers/auth.js
import bcrypt from "bcrypt";

/**
 * @route POST v1/auth/login
 * @desc logs in a user
 * @access Public
 */
export async function Login(req, res) {
    // Get variables for the login process
    const { email } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email }).select("+password");
        if (!user)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        // if user exists
        // validate password
        const isPasswordValid = bcrypt.compare(
            `${req.body.password}`,
            user.password
        );
        // if not valid, return unathorized response
        if (!isPasswordValid)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        // return user info except password
        const { password, ...user_data } = user._doc;

        res.status(200).json({
            status: "success",
            data: [user_data],
            message: "You have successfully logged in.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    res.end();
}
By default, mongoose returns the user’s password anytime a query is made on that document, but I have disabled that inside the User.js model by using ‘select: false’. So that I only need to call for the password when I need it. In your login logic, you need the user’s password in your database to compare it with the password the user is attempting to log in with. If both are the same, you can say that you know that user and allow him in.

Create a Login route

Inside your routes’ auth.js file,

Import the Login function
Add a Login route
Compare your code:

File Path - v1/routes/auth.js
// Login route == POST request
router.post(
    "/login",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("password").not().isEmpty(),
    Validate,
    Login
);
Send a POST request to http://localhost:5005/v1/auth/login

login response

Add Session to Login logic

So far you can log users into your app. But wait, will you have to re-authenticate a user on every request? HTTP is stateless, so the server treats each request as a new one. To solve this, you have to look for a way to let the server know that a particular request is coming from the same client. Fortunately, the request headers come to the rescue. The request headers contain information about the client or resources being requested.

For each request, the request headers are sent to the server. You will find out that some headers persist with requests while others may not. We will use the cookie header for this guide. That means if you want the server to trust a client, you may use cookies.

Cookies can serve different purposes. They can be used for authentication. Cookies also allow you to specify the duration of the authentication.

In practice, you want to enable the server to provision a "Session" for a client. The session will contain an identity token and a duration (before the token is considered invalid). The server will always look out for this session in the request headers coming from the client at each request, if it is found and within the duration, it authenticates the client, otherwise, it rejects authentication.

For this article, our server will be using JSON Web Token (JWT) to provision identity tokens for clients. We will generate a token on every login and set it as a value for the cookie header.

Json Web Tokenss are an open, industry-standard RFC 7519 method for representing claims securely between two parties.

Now, to add a session to your login logic, follow these steps:

Create a secret key
Create a function to generate tokens at login
Add the generate-token function to the login logic
Create a secret key

The JWT technology allows you to generate, decode, and verify tokens. It digitally signs tokens so that they can be trusted. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA. You may learn more about JWTs here. JWT verifies a token by checking the signature.

To sign a token, create a unique secret key only known by your server. You may generate a random key using node. To do that,

Type node in your terminal, press the return key,
Type crypto.randomBytes(20).toString(‘hex’)
For me, I got something like,

access token

Copy the value and paste it into your .env file as the value for SECRET_ACCESS_TOKEN
Create a function to generate tokens at login

To create a function to generate and sign tokens at login,

Go to your User model file (models/User.js)
Import JWT module
Import the secret key from the config file
Add a generate-token function after the pre-hook function
Examine the following code:

File Path - v1/models/User.js
...
import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '../config/index.js';
...
...
UserSchema.methods.generateAccessJWT = function () {
  let payload = {
    id: this._id,
  };
  return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
    expiresIn: '20m',
  });
};
We added a new function called "generateAccessJWT" to the UserSchema methods. The function signs the user ID with a secret key and generates a unique token which expires in 20 minutes.

Now you have to use the generateAccessJWT function (which is now one of the UserSchema methods) in the login function.

Add the generate-token function to the login logic

Once, a user provides an email and password, and the API confirms the details to be correct, we will then generate a unique token for that user, and send the token generated to the client.

Examine the following code:

File Path - v1/controllers/auth.js
/**
 * @route POST v1/auth/login
 * @desc logs in a user
 * @access Public
 */
export async function Login(req, res) {
    // Get variables for the login process
    const { email } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email }).select("+password");
        if (!user)
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Account does not exist",
            });
        // if user exists
        // validate password
        const isPasswordValid = bcrypt.compare(
            `${req.body.password}`,
            user.password
        );
        // if not valid, return unathorized response
        if (!isPasswordValid)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });

        let options = {
            maxAge: 20 * 60 * 1000, // would expire in 20minutes
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };
        const token = user.generateAccessJWT(); // generate session token for user
        res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
        res.status(200).json({
            status: "success",
            message: "You have successfully logged in.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    res.end();
}
The same login function, only that we have added the ability to generate sessions once credentials are confirmed. Anytime a client successfully logs in, a new session is generated.

We now have an authentication system which verifies credentials and generates unique sessions.

Authorization Logic
Let’s implement a simple authorization flow. Remember, authorization is ensuring that a user can only do what we allow him to do on the app.

I have created another user, called Admin. I will manually upgrade his role to an admin (an admin will have the code 0x88 for his role), and as you may rightly guess, that is 136. You should use complex code for role assignment in production.

I am logged in as an admin,

admin login response

Next, you want to add middleware functions to tell your API to verify the session and verify role or access.

To get started, create a file inside the middleware folder, and name it "verify.js". This file will be used to verify the session and role.

Verify Session

Your API will have to determine if a session is valid or not. For security purposes, it must do that on every request to a protected route.

To verify the user session,

Inside the verify.js file, import the User model,
Import JWT
Write the verify function
Create a user route
Add the verify middleware to the user route
Examine the following code:
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function Verify(req, res, next) {
    try {
        const authHeader = req.headers["cookie"]; // get the session cookie from request header

        if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
        const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt

        // Verify using jwt to see if token has been tampered with or if it has expired.
        // that's like checking the integrity of the cookie
        jwt.verify(cookie, config.SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                // if token has been altered or has expired, return an unauthorized error
                return res
                    .status(401)
                    .json({ message: "This session has expired. Please login" });
            }

            const { id } = decoded; // get user id from the decoded token
            const user = await User.findById(id); // find user by that `id`
            const { password, ...data } = user._doc; // return user object without the password
            req.user = data; // put the data object into req.user
            next();
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}
Next, create a user route and add the verify middleware to it.

Inside the index.js file (routes folder), add:

File Path - v1/routes/index.js
app.get("/v1/user", Verify, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the your Dashboard!",
    });
});
To test this feature:

Send a GET request to /v1/user without or with an invalid cookie. You should see an unauthorized response. Why? The cookie is invalid or not present.
GIFUnsuccessful attempt to access user's dashboard

Log in using a valid user
Send a GET request to the user route (/v1/user).
If everything goes well, you should see a Welcome message.

GIFAuthorized access into user's dashboard

Let's explain where we are now. We have written a login function that takes the user's credentials and checks against the database. It then generates a user session which is sent to the client as a cookie. The client includes that information on subsequent requests it sends to the server. The Verify middleware instructs the server to check the client's header for the authentication/authorization cookie, decode it, and assign a user object to the request object. If the verification middleware catches an error, the next middleware is not called.

Next, you want to add an admin route which only an admin can access.

To do that, first, create a verify role middleware,

File Path - v1/middleware/verify.js
export function VerifyRole(req, res, next) {
    try {
        const user = req.user; // we have access to the user object from the request
        const { role } = user; // extract the user role
        // check if user has no advance privileges
        // return an unathorized response
        if (role !== "0x88") {
            return res.status(401).json({
                status: "failed",
                message: "You are not authorized to view this page.",
            });
        }
        next(); // continue to the next middleware or function
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}
Then inside your index.js file (routes' folder) add:

File Path - v1/routes/index.js
import { Verify, VerifyRole } from "../middleware/verify.js";

app.get("/v1/admin", Verify, VerifyRole, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the Admin portal!",
    });
});
Notice, that the preceding code includes the Verify middleware, then the VerifyRole middleware. The API first verifies the user's session and returns a user object which is accessed by the req.user object. The VerifyRole middleware checks the user object to determine if the user is an admin or not. If a user is an admin, the admin portal is opened, else the user is not allowed to view the page.

To test this feature:

Log in using a user with low privilege access. (Remember users are assigned 0x01 by default as their role code)
Send a GET request to the admin route (v1/admin)
GIFUnsuccessful attempt to access the admin portal

You got an unauthorized response.

Why? The cookie for a user with low privilege can’t access the admin portal.

Now, log in as an admin
Send a GET request to the admin route (v1/admin)
GIFAuthorized access into the admin portal

Logout logic
Finally, you may want to add a logout functionality. For that, you have two basic options. One is to blacklist the request cookie on logout, the other is to invalidate the cookie by sending an invalid cookie to the client. The latter is not advisable because if the previous cookie was kept somewhere before logout, it can still be used to log in. Here, you will be implementing the first.

Create another file inside the models' folder and name it "Blacklist.js", that is the document that will store any blacklisted token.
File Path - v1/models/Blacklist.js
import mongoose from "mongoose";
const BlacklistSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            ref: "User",
        },
    },
    { timestamps: true }
);
export default mongoose.model("blacklist", BlacklistSchema);
So this is it - on logout, user’s session token will be blacklisted i.e. added to the blacklist document. Now, whenever the user comes back to access protected routes, your API first checks to see if his token is on the blacklist or not, if it is, he gets an unauthorized response and needs to be re-authenticated, otherwise he is allowed access. You could also look for a way to clear the cookie from the client.

Here is a simple code, add it to your auth.js file (controllers folder).

File Path - v1/controllers/auth.js
...
import Blacklist from '../models/Blacklist.js';
...
/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Public
 */
export async function Logout(req, res) {
  try {
    const authHeader = req.headers['cookie']; // get the session cookie from request header
    if (!authHeader) return res.sendStatus(204); // No content
    const cookie = authHeader.split('=')[1]; // If there is, split the cookie string to get the actual jwt token
    const accessToken = cookie.split(';')[0];
    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
    // if true, send a no content response.
    if (checkIfBlacklisted) return res.sendStatus(204);
    // otherwise blacklist token
    const newBlacklist = new Blacklist({
      token: accessToken,
    });
    await newBlacklist.save();
    // Also clear request cookie on client
    res.setHeader('Clear-Site-Data', '"cookies"');
    res.status(200).json({ message: 'You are logged out!' });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
  res.end();
}
One more thing, in your verify function, check the cookie to determine if blacklisted or not. If blacklisted, ask the user to re-login, otherwise, call the next function.

Compare your code with the following:
export async function Verify(req, res, next) {
    const authHeader = req.headers["cookie"]; // get the session cookie from request header

    if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
    const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt token
    const accessToken = cookie.split(";")[0];
    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
    // if true, send an unathorized message, asking for a re-authentication.
    if (checkIfBlacklisted)
        return res
            .status(401)
            .json({ message: "This session has expired. Please login" });
    // if token has not been blacklisted, verify with jwt to see if it has been tampered with or not.
    // that's like checking the integrity of the accessToken
    jwt.verify(accessToken, SECRET_ACCESS_TOKEN, async (err, decoded) => {
        if (err) {
            // if token has been altered, return a forbidden error
            return res
                .status(401)
                .json({ message: "This session has expired. Please login" });
        }

        const { id } = decoded; // get user id from the decoded token
        const user = await User.findById(id); // find user by that `id`
        const { password, ...data } = user._doc; // return user object but the password
        req.user = data; // put the data object into req.user
        next();
    });
}
Don’t forget to add the logout function to auth route, like so,

File Path - v1/routes/auth.js
...
// Logout route ==
router.get('/logout', Logout);
If you don't like seeing JWT in cookies, you can encrypt it or use express-session as an alternative to ordinary JWT.

Now, your API is able to authenticate and authorize users. Thank you for reading, and don’t forget to follow me for more.

Other link: https://mjosh.hashnode.dev/build-a-login-and-logout-api-using-expressjs-nodejs

Top comments (13)
Subscribe
pic
Add to the discussion
 
 
trener_107 profile image
Maksym Sokolov
•
Dec 31 '23

Good article, thank you. But I found some bug in login logic. Need add await for this code, because isPasswordValid - always return Promise (true). Thanks again)
const isPasswordValid = await bcrypt.compare(
            `${req.body.password}`,
            user.password
        );


1
 like
Like
Reply
 
 
m_josh profile image
Joshua M 
•
Jan 16

Correct! Thanks for pointing out Maksym.
My hands are presently full. Will edit the article once I have a free time


1
 like
Like
Reply
 
 
mrmalik16 profile image
Sharjeel Faiq
•
Apr 6

I found that too. The guide is very useful and valuable. Please correct the mistake for the new learners. Thanks.


Like
Reply
 
 
hitheshkp profile image
hithesh
•
Nov 30 '23

Thank you for the amazing content it really helped me


2
 likes
Like
Reply
 
 
mrmalik16 profile image
Sharjeel Faiq
•
Apr 16 • Edited on Apr 16

If the command crypto.randomBytes(20).toString(‘hex’) does not generate a secret access token for you, then try the following one, i.e.

crypto.randomUUID(20).toString('hex')
'85ec4cea-2164-4ef7-ae91-b6d83208c3b9'


Like
Reply
 
 
mrmalik16 profile image
Sharjeel Faiq
•
Apr 6

This is useful and amazing. Thanks a lot.


1
 like
Like
Reply
 
 
usmaanrangrez profile image
usmanrangrez
•
Apr 8

JWT are supposed to be stateless right?


Like
Reply
 
 
kumar1821 profile image
kumar
•
Jun 13

values imported from dotenv file are read "undefined". What should I do?


1
 like
Like
Reply
 
 
kumar1821 profile image
kumar
•
Jun 13

Sorted out!! .env file was inside v1 folder.


1
 like
Like
Reply
 
 
eeshal_teluri profile image
Eeshal Teluri
•
Jul 16

Thank you very very much Josh, for taking your time and writing this post.


1
 like
Like
Reply
 
 
golbangi1000 profile image
DongWook Kim
•
Dec 6 '23

hello why are
const app = express() , const server = express() ?


Like
Reply
 
 
mrmalik16 profile image
Sharjeel Faiq
•
Apr 16

It doesn't matter how you name a variable, the app and the server variable will always be the same and behave the same way.


2
 likes
Like
Reply
 
 
m_josh profile image
Joshua M 
•
Nov 30 '23

I am glad this helped you. If you have any question regarding this, you may drop in the comment


Like
Reply
Code of Conduct • Report abuse
Read next
pachicodes profile image
Debugging JavaScript: Tools and Techniques
Pachi 🥑 - Jul 16

matin_mollapur profile image
The Future of Full-Stack Development in 2024: Trends and Best Practices
Matin Mollapur - Jul 16

sh20raj profile image
Single Page Applications (SPAs)
Sh Raj - Jul 16

jacobsternx profile image
Day 11 of 100 Days of Code
Jacob Stern - Jul 12


Joshua M
Follow
Full stack Developer, building scalable applications.
JOINED
Mar 14, 2023
More from Joshua M
The foundation of web page manipulation and interaction
#beginners #dom #javascript #html
export function VerifyRole(req, res, next) {
    try {
        const user = req.user; // we have access to the user object from the request
        const { role } = user; // extract the user role
        // check if user has no advance privileges
        // return an unathorized response
        if (role !== "0x88") {
            return res.status(401).json({
                status: "failed",
                message: "You are not authorized to view this page.",
            });
        }
        next(); // continue to the next middleware or function
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}