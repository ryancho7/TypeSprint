import app from '../app.js';
import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: 'http://localhost:4000', credentials: true }
});

// simple in-memory game state
const races = {}; // { raceId: { text, participants: { socketId: progress } } }

async function fetchRandomSentence() {
    try {
        const res = await fetch('http://localhost:3000/api/text/getSentence');
        const data = await res.json();
        return data.sentence;
    } catch (error) {
        console.error('Error fetching sentence:', error);
        return "The boring default text for you to type";
    }
}

async function saveRaceResult(username, wpm, finishingPosition) {
    try {
        await fetch('http://localhost:3000/api/games/results', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                wpm: wpm,
                finishingPosition: finishingPosition
            })
        });
    } catch (error) {
        console.error('Error saving race result:', error);
    }
}

io.on('connection', (socket) => {
    console.log('client connected:', socket.id);

    socket.on('joinRace', async ({ raceId, username }) => {
        socket.join(raceId);
        if (!races[raceId]) {
            const sentenceText = await fetchRandomSentence();
      
            races[raceId] = {
                text: sentenceText,
                participants: {},
                startTime: null,
                finishOrder: []
            };
        }
        races[raceId].participants[socket.id] = {
            progress: 0,
            accurateFinish: false,
            username: username || socket.id,
            startTime: null,
            endTime: null
        };
        io.in(raceId).emit('raceState', races[raceId]);
    });

    socket.on('updateProgress', ({ raceId, progress, accurateFinish }) => {
        if (!races[raceId]) return;

        const race = races[raceId];
        const participant = race.participants[socket.id];

        // time start on first keystroke
        if(!participant.startTime && progress > 0) {
            participant.startTime = Date.now();
            if(!race.startTime) {
                race.startTime = Date.now();
            }
        }

        participant.progress = progress;
        
        // handle race completion -> ensure that there is no duplicate finishing
        if(accurateFinish && !participant.accurateFinish) {
            participant.accurateFinish = true;
            participant.endTime = Date.now();
            // update finished order
            race.finishOrder.push(socket.id);
            const finishingPosition = race.finishOrder.length;
            // calculate wpm based on start and end time
            const min = (participant.endTime - participant.startTime) / (1000 * 60);
            const wordCount = race.text.split(' ').length;
            const wpm = Math.round(wordCount / min);
            // save result
            saveRaceResult(participant.username, wpm, finishingPosition);
            // emit completion
            io.in(raceId).emit('raceComplete', {
                socketId: socket.id,
                username: participant.username,
                wpm,
                finishingPosition
            });
        }

        io.in(raceId).emit('progressUpdate', {
            participants: races[raceId].participants
        });
    });

    socket.on('startRace', ({ raceId }) => {
        if (races[raceId]) {
            races[raceId].startTime = Date.now();
            io.in(raceId).emit('start', { text: races[raceId].text });
        }
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
