const {customAlphabet} = require('nanoid/async');

const customIdGenerator = customAlphabet('0123456789abcde', 10);


module.exports = {
    getNewId: async function(length = 4){
        const ids = [];
        for(let i = 0; i < length; i++){
            ids.push(await customIdGenerator());
        }
        return ids.join('-');
    }
}