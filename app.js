import { fastify } from "fastify";
import "dotenv/config";
import { buildAdminRouter } from "./config/setup.js";
import { connectDb } from "./config/connect.js";
import { sessionStore, PORT, COOKIE_PASSWORD } from './config/config.js';
import { registerRoutes } from "./routes/index.js";
import fastifySocketIo from "fastify-socket.io";


const start = async () => {
    await connectDb(process.env.MONGO_URI);
    const app = fastify();
    await registerRoutes(app);
    await buildAdminRouter(app);
    
    app.register(fastifySocketIo, {
        cors: {
            origin: "*",
        },
        pingInterval: 10000,
        pingTimeout: 5000,
        transports: ['websocket'],
    });

    console.log(PORT);
    app.listen(PORT, (err, addr) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(`Blinkit Started on http://localhost:${PORT}`)
        }
    })

    app.ready().then(() => {
        app.io.on("connection", (socket) => {
            console.log("user_connected");

            // Listen for the joinRoom event from the client
            socket.on("joinRoom", (orderId) => {
                socket.join(orderId);  // Joins the room
                console.log(`User Joined room ${orderId}`);
            });

            socket.on("disconnect", () => {
                console.log(`User Disconnected`);
            });
        });
    });

};
start();