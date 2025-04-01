class HargaSlot {
    constructor() {
      this.prices = {
        knuck: {
          title: "Senjata Knuckle",
          prime: "150m",
          piercer: "15m",
          aliases: ["knuck", "knuckles", "tinju"],
        },
        ohs: {
          title: "Senjata OHS",
          prime: "300m",
          piercer: "35m",
          aliases: ["ohs", "one handed sword", "pedang 1 tangan"],
        },
        ths: {
          title: "Senjata THS",
          prime: "180m",
          piercer: "25m",
          aliases: ["ths", "two handed sword", "pedang 2 tangan"],
        },
        bow: {
          title: "Senjata Bow",
          prime: "250m",
          piercer: "30m",
          aliases: ["bow", "busur"],
        },
        staff: {
          title: "Senjata Staff",
          prime: "200m",
          piercer: "20m",
          aliases: ["staff", "tongkat"],
        },
        halberd: {
          title: "Senjata Halberd",
          prime: "150m",
          piercer: "15m",
          aliases: ["halberd", "tombak", "hb"],
        },
        katana: {
          title: "Senjata Katana",
          prime: "200m",
          piercer: "20m",
          aliases: ["katana"],
        },
        bowgun: {
          title: "Senjata Bowgun",
          prime: "200m",
          piercer: "20m",
          aliases: ["bowgun", "senjata peluru"],
        },
        magicdevice: {
          title: "Senjata Magic Device",
          prime: "200m",
          piercer: "20m",
          aliases: ["magic device", "senjata sihir"],
        },
        armor: {
          title: "Armor",
          prime: "150m",
          piercer: "15m",
          aliases: ["armor", "baju"],
        },
        helmet: {
          title: "Helmet",
          prime: "100m",
          piercer: "10m",
          aliases: ["helm", "topi"],
        },
        ring: {
          title: "",
          prime: "100m",
          piercer: "10m",
          aliases: ["ring", "cincin"],
        }
      };
    }
  
    async findCategory(input) {
      const categoryKey = Object.keys(this.prices).find((key) =>
        this.prices[key].aliases.includes(input)
      );
      return categoryKey ? this.prices[categoryKey] : null;
    }
  }
  
  module.exports = HargaSlot;
  