const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  sayi: { type: Number, default: 0 },
  reasons: { type: [{ reason: String, by: String, date: { type: Date, default: Date.now } }], default: [] }
});

module.exports = model("luhux-uyari", schema);
