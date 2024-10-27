import "dotenv/config"
import FastifySession from '@fastify/session'
import ConnectMongoDBSession  from "connect-mongodb-session"

const MongoDBStore = ConnectMongoDBSession(FastifySession);


export const sessionStore = new MongoDBStore({
    uri : process.env.MONGO_URI,
    collection : "sessions",
})

sessionStore.on("error", (error) => {
    console.log("Session store error ",error)
    
});

const authenticate = async (email, password) => {
    if (email === "jaituteja90@gmail.com"&& password === "12345") {
      return Promise.resolve({email : email, password : password});
    }
    return null
  }

  export const PORT = process.env.PORT || 3000;
  export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
  