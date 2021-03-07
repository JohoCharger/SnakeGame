const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class HighscoreService {
    constructor(dataFile) {
        this.dataFile = dataFile;
    }

    async setData(data) {
        await writeFile(this.dataFile, JSON.stringify(data));
    }

    async getData() {
        const data = await readFile(this.dataFile, "utf-8");
        if (!data) return [];
        return JSON.parse(data);
    }


}

module.exports = HighscoreService;