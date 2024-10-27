import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJSFastify from "@adminjs/fastify";
// Import Mongoose models
import { Admin, Category, Counter, Customer, DeliveryPartner, Order, Product} from "../model/index.js";
import { COOKIE_PASSWORD, sessionStore } from "./config.js";
import { Branch } from "../model/branch.js";

// Register the Mongoose adapter
AdminJS.registerAdapter(AdminJSMongoose);

// Create an AdminJS instance
const adminJs = new AdminJS({
  resources: [
    {
      resource: Customer,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: DeliveryPartner,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Admin,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Product,
    },
    {
      resource: Category,
    },
    {
      resource: Counter,
    },
    {
      resource: Order,
    },
    {
      resource: Branch,
    },
   
  ],
  rootPath: "/admin",
  branding: {
    companyName: "Blinkit",
    theme: {
      colors: {
        primary100: "#FF5733",
      },
    },
  },
});

export const buildAdminRouter = async (app) => {
  await AdminJSFastify.buildRouter(
    adminJs, // Pass the AdminJS instance here
    app,
    {
      store: sessionStore,
      saveUninitialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
};