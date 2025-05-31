import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { matchMaker } from "colyseus";
import { stringify } from 'flatted';

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/Room";

export default config({

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('room', MyRoom).enableRealtimeListing();

    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        app.get("/room_list", async (req, res) => {
            const rooms = await matchMaker.query({ private: false, locked: false });
            res.send(JSON.stringify(rooms));
        });

        app.post("/join_private", async (req, res) => {
            let name = req.body.roomName;
            let pass = req.body.roomPassword;
            console.log(name, pass);
            await matchMaker.query({ name: name }).then(async (room) => {
                console.log(room);
                if (room[0]?.metadata.roomPass === pass) {
                    await matchMaker.joinById(room[0].roomId);
                    res.sendStatus(200);
                } else {
                    res.sendStatus(401);
                }
            });

        });

        app.post("/create_room", async (req, res) => {
            let roomName = req.body.roomName;
            let createdBy = req.body.createdBy;
            let roomPassword = req.body.roomPassword;
            let room;
            if (roomPassword) {
                room = await matchMaker.createRoom('room', {});
                room.metadata = {
                    roomPass: roomPassword,
                    createdBy: createdBy,
                    displayName: roomName
                }
                room.private = true;
            } else {
                room = await matchMaker.createRoom('room', {});
                room.metadata = {
                    createdBy: createdBy,
                    displayName: roomName
                }
            }
            res.send(room);
        });
        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground());
        }

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/monitor", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
