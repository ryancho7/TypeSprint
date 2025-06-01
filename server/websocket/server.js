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

// helper room clean up function -> empty rooms should be deleted
function cleanupRace(raceId) {
    if(races[raceId] && Object.keys(races[raceId].participants).length === 0) {
        delete races[raceId];
        console.log(`Race ${raceId} has been cleaned up`);
    }
}

// helper function for resetting race/starting new race when all participants have finished
function resetRaceIfNeeded(raceId) {
    if(!races[raceId]) return;

    const race = races[raceId];
    const activeParticipants = Object.keys(race.participants);
    
    // check if all participants have finished the race -> use ws acurate finish value
    const allFinished = activeParticipants.length > 0 && activeParticipants.every(socketId => race.participants[socketId].accurateFinish);
    if(allFinished) {
        console.log(`All active participants have finished: Resetting race ${raceId}`);
        // reset the state to default vals
        race.startTime = null;
        race.finishOrder = [];
        // reset all participants
        Object.values(race.participants).forEach(participant => {
            participant.progress = 0;
            participant.accurateFinish = false;
            participant.startTime = null;
            participant.endTime = null;
        });
    }
}



io.on('connection', (socket) => {
    console.log('client connected:', socket.id);

    socket.on('joinRace', async ({ raceId, username }) => {
        socket.join(raceId);

        // reset races if needed to avoid persisting state bugs
        resetRaceIfNeeded(raceId);

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

        if(!participant) return;

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
            // update finished order but only add if not duplicate
            if(!race.finishOrder.includes(socket.id)) {
                race.finishOrder.push(socket.id);
            }
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
        console.log('client disconnecting:', socket.id);
        for (const room of socket.rooms) {
            if (races[room]?.participants) {
                // find the specific participant
                const participant = races[room].participants[socket.id];
                if(participant) {
                    console.log(`Removing ${participant.username} from race ${room}`);
                    // remove participant from room
                    delete races[room].participants[socket.id];
                    // remove them from finishing order
                    const index = races[room].finishOrder.indexOf(socket.id);
                    if(index > -1) {
                        races[room].finishOrder.splice(index, 1);
                    }
                }
                io.in(room).emit('progressUpdate', {
                    participants: races[room].participants
                });
                // cleanup room
                cleanupRace(room);
            }
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`listening on ${PORT}`));
