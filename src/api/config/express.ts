import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import methodOverride from "method-override";
import morgan from "morgan";
import passport from "passport";

import { logs } from "@config/vars";

import {
  converter as errorConverter,
  notFound,
  parser as errorParser,
} from "../middlewares/error-handler";

import { jwt } from "./passport";
import { router } from "./routes";

export const app = express();

app.use(morgan(logs)); // request logging - dev: console | production: file
app.use(methodOverride()); // lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
app.use(helmet()); // secure apps by setting various HTTP headers
app.use(cors()); // enable CORS - Cross Origin Resource Sharing
app.use(bodyParser.json()); // parse body params and attach them to req.body when Content-Type is JSON
app.use(bodyParser.urlencoded({ extended: true })); // parse body params and attach them to req.body when Content-Type is urlEncoded

app.use(passport.initialize()); // Initialize passport
passport.use("jwt", jwt); // Initialize jwt authentication strategy

app.use("/api", router); // setup application routes

app.use(notFound); // catch 404
app.use(errorConverter); // if error is not an instanceOf APIError, convert it before sending back response
app.use(errorParser); // parse error response and delete stack trace if in production
