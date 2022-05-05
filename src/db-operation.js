const { onValue } = require('firebase/database');
const {set, ref, db} = require('./firebase');
const idGenerator = require('./id-generator');




console.log(db);



module.exports = {
    createNewGame: async function(players, gameConfig){
        const gameid = await idGenerator.getNewId();
        const self = this;
        set(ref(db, `/game-data/${gameid}`), {
            info: {
                createdTime: new Date().getTime(),
                game: {
                    size: gameConfig.size
                },
                players: {
                    player1: players[0],
                    player2: players[1]
                }
            }
        })
        return {
            gameid,
            onStateChanged: self.onStateChanged
        };
    },
    deleteGame: function(gameId){

    },
    saveState: function (gameid, data){
        if(!(gameid && data)) return;
        set(ref(db, `/game-data/${gameid}/data`), data);
        console.log('save state', data);
    },
    onStateChanged: function (gameid, callback){
        onValue(ref(db, `/game-data/${gameid}/data`), (snapshot) => {
            const data = snapshot.val();
            data && callback(data);
        });
    }
};