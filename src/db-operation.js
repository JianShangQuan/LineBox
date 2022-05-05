const { onValue, get } = require('firebase/database');
const {set, ref, db, remove} = require('./firebase');
const idGenerator = require('./id-generator');

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
                players: players
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
        set(ref(db, `/game-data/${gameid}/data`), data).then(res => console.log(res)).catch(err => console.log(err));
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
    dispose: function(){
        onChangedListener(); // detatch change
        onChangedListener = null;
        remove(ref(db, `/game-data/${gameId}`))
    }
};