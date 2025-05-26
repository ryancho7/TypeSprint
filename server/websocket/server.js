import app from '../app.js';
import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: 'http://localhost:4000', credentials: true }
});

// simple in-memory game state
const races = {}; // { raceId: { text, participants: { socketId: progress } } }

io.on('connection', (socket) => {
    console.log('client connected:', socket.id);

    socket.on('joinRace', ({ raceId }) => {
        socket.join(raceId);
        races[raceId] ||= { text: "Testing text", participants: {} };
        races[raceId].participants[socket.id] = {
            progress: 0,
            accurateFinish: false
        };
        io.in(raceId).emit('raceState', races[raceId]);
    });

    socket.on('updateProgress', ({ raceId, progress, accurateFinish }) => {
        if (!races[raceId]) return;

        const participant = races[raceId].participants[socket.id];

        participant.progress = progress;
        participant.accurateFinish = accurateFinish;

        io.in(raceId).emit('progressUpdate', {
            participants: races[raceId].participants
        });
    });

    socket.on('startRace', ({ raceId }) => {
        io.in(raceId).emit('start', { text: races[raceId].text });
    });

    socket.on('disconnecting', () => {
        for (const room of socket.rooms) {
            if (races[room]?.participants) {
                delete races[room].participants[socket.id];
                io.in(room).emit('progressUpdate', {
                    participants: races[room].participants
                });
            }
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`listening on ${PORT}`));
