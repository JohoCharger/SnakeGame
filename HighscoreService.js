const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class HighscoreService {
    constructor(dataFile) {
        this.dataFile = dataFile;
    }

    async setData(data) {
        await writeFile(this.dataFile, JSON.stringify(data, null, 4));
    }

    async getData() {
        const data = await readFile(this.dataFile, "utf-8");
        if (!data) return [];
        return JSON.parse(data);
    }

    async setNewHighscore(highscore) {
        const data = await this.getData();
        for (let i = 0; i < data.length; i++) {
            if (highscore.score > data[i].score) {
                data.splice(i, 0, highscore);
                break;
            }
        }
        if (data.length > 5) data.pop();
        await this.setData(data);
    }
}

module.exports = HighscoreService;