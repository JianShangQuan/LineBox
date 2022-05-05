const { onValue, get } = require('firebase/database');
const {set, ref, db, off} = require('./firebase');
const idGenerator = require('./id-generator');




console.log(db);


let onChangedListener = null;
let gameId = null


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
        }).then((res) => gameId = gameid);
        return {
            gameid,
            onStateChanged: self.onStateChanged
        };
    },
    deleteGame: function(gameId = gameId){

    },
    saveState: function (gameid = gameId, data){
        if(!(gameid && data)) return;
        set(ref(db, `/game-data/${gameid}/data`), data);
    },
    getGameInfo: function(gameid = gameId){
        return get(ref(db, `/game-data/${gameid}/info`))
                .then((snapshot) => snapshot?.val());
    },
    onStateChanged: function (gameid = gameId, callback){
        onChangedListener = onValue(ref(db, `/game-data/${gameid}/data`), (snapshot) => {
            const data = snapshot.val();
            data && callback(data);
        });
    },
    clean: function(){
        onChangedListener(); // detatch change
        onChangedListener = null;
    }
};