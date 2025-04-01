const axios = require("axios");
const cheerio = require("cheerio");

class fillstat{
    async fillStat(parsedMessage) {
        const { type, potValue, stats } = parsedMessage;
        const statTranslate = {
         "a%": "ATK+%25",
		 "a": "ATK",
		 "m%": "MATK+%25",
		 "m": "MATK",
		 "s%": "STR+%25",
		 "s": "STR",
		 "d%": "DEX+%25",
		 "d": "DEX",
		 "i%": "INT+%25",
		 "i": "INT",
		 "v%": "VIT+%25",
		 "v": "VIT",
		 "ag%": "AGI+%25",
		 "ag": "AGI",
		 "cd%": "Critical+Damage+%25",
		 "cd": "Critical+Damage",
		 "cr%": "Critical+Rate+%25",
		 "cr": "Critical+Rate",
		 "dtf%": "%25+luka+ke+Api",
		 "dte%": "%25+luka+ke+Bumi",
		 "dtw%": "%25+luka+ke+Air",
		 "dta%": "%25+luka+ke+Angin",
		 "dtl%": "%25+luka+ke+Cahaya",
		 "dtd%": "%25+luka+ke+Gelap",
		 "aspd": "Kecepatan+Serangan",
		 "aspd%": "Kecepatan+Serangan+%25",
		 "cspd": "Kecepatan+Merapal",
		 "cspd%": "Kecepatan+Merapal+%25",
		 "fire": "Unsur+Api+%28no+matching%29",
		 "water": "Unsur+Air+%28no+matching%29",
		 "earth": "Unsur+Bumi+%28no+matching%29",
		 "wind": "Unsur+Angin+%28no+matching%29",
		 "light": "Unsur+Cahaya+%28no+matching%29",
		 "dark": "Unsur+Gelap+%28no+matching%29",
		 "firem": "Unsur+Api+%28matching%29",
		 "waterm": "Unsur+Air+%28matching%29",
		 "earthm": "Unsur+Bumi+%28matching%29",
		 "windm": "Unsur+Angin+%28matching%29",
		 "lightm": "Unsur+Cahaya+%28matching%29",
		 "darkm": "Unsur+Gelap+%28matching%29",
		 "acc": "Accuracy",
		 "dodge": "Dodge",
		 "acc%": "Accuracy+%25",
		 "dodge%": "Dodge+%25",
		 "stab%": "Stability+%25",
		 "mpierce%": "Magic+Pierce+%25",
		 "ppierce%": "Penetrasi+Fisik+%25",
		 "hpregen": "Natural+HP+Regen",
		 "mpregen": "Natural+MP+Regen",
		 "hpregen%": "Natural+HP+Regen+%25",
		 "mpregen%": "Natural+MP+Regen+%25",
		 "def": "DEF",
		 "mdef": "MDEF",
		 "def%": "DEF+%25",
		 "mdef%": "MDEF+%25",
         "mres%": "Kekebalan+Sihir+%25",   
         "pres%": "Kekebalan+Fisik+%25",
        };
    
        const positiveStats = [];
        const negativeStats = [];
    
        stats.forEach(({ stat, value }) => {
            const statName = statTranslate[stat] || stat;
            if (value < 0) {
                negativeStats.push({ stat: statName, value: "MAX" });
            } else {
                positiveStats.push({ stat: statName, value: value });
            }
        });
    
        while (positiveStats.length < 7) positiveStats.push({ stat: "", value: "MAX" });
        while (negativeStats.length < 7) negativeStats.push({ stat: "", value: "MAX" });
    
        const data = await this.buildData(positiveStats, negativeStats, potValue, type);
    
        const properType = type === "weapon" ? "BukiProper" : "BouguProper";
        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://tanaka0.work/id/${properType}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": "JSESSIONID=9C4CB3F3674603DFAFCA22054CC2B976",
            },
            data: data,
        };
    
        try {
            const response = await axios.request(config);
            return this.processResponse(response.data, type, potValue);
        } catch (error) {
            console.error("Error:", error);
            return `Terjadi kesalahan saat mengambil data. Error: ${error.message}`;
        }
    }    
    
    async buildData(positiveStats, negativeStats, potValue, type) {
        const paramLevel = 300; // Ubah jika ada logika berbeda
        let jenis;
        if (type === "armor" || type === "weapon") {
            jenis = type.charAt(0).toUpperCase() + type.slice(1); 
          }

        let data = `properBui=${jenis}&paramLevel=${paramLevel}`;
    
        positiveStats.forEach((stat, index) => {
            data += `&plusProperList%5B${index}%5D.properName=${stat.stat}&plusProperList%5B${index}%5D.properLvHyoji=${stat.value}`;
        });
    
        negativeStats.forEach((stat, index) => {
            data += `&minusProperList%5B${index}%5D.properName=${stat.stat}&minusProperList%5B${index}%5D.properLvHyoji=MAX`;
        });
    
        data += `&shokiSenzai=${potValue}&kisoSenzai=15&jukurendo=0&rikaiKinzoku=10&rikaiNunoti=10&rikaiKemono=10&rikaiMokuzai=10&rikaiYakuhin=10&rikaiMaso=10&sendData=Submit`;
    
        return data;
    }
    
    async processResponse(responseHtml, type, potValue) {
        const $ = cheerio.load(responseHtml);
    
        const stat = $('#main > div:nth-of-type(2)').clone();
        stat.find('h3, a, font, b').remove();
        const formattedStat = stat.text().trim()
            .replace(/(\w+\s*%?)\s*(Lv\.(-?\d+))/g, (match, p1, p2, p3) => {
                const sign = parseInt(p3) >= 0 ? '+' : '';
                return `${p1} ${sign}${p3}`;
            })
            .replace(/\s+/g, ' ')
            .replace(/\s*,\s*/g, ', ');
    
        const steps = $('#main div:nth-of-type(4)').text().trim()
            .replace(/Steps\b/, '')
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/(\d+\.\s+)/g, '\n$1');
    
        return `*Chizuru-chan🌸*
Jenis: ${type}
Pot: ${potValue}
Level Karakter: 300
    
Stat akhir: 
${formattedStat}
    
${steps}`;}    
}
module.exports = fillstat;