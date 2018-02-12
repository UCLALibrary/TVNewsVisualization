const KeywordList = require('./KeywordList');
let keywordList = new KeywordList(0.002);
let transcripts = [
	'./data/test/transcript.json'
];
keywordList.addTranscripts(transcripts, () => {
	keywordList.readFreqWords('./data/freqWords_2016_en_50k.csv', () => {
		keywordList.build(runServer);
	 }, true);
});

const runServer = () => {

	const express = require("express");
	const app = express();

	app.set("port", process.env.PORT || 3001);

	// Express only serves static assets in production
	if (process.env.NODE_ENV === "production") {
		app.use(express.static("client/build"));
	}

	app.get("/api/searchbar", (req, res) => {
		const param = req.query.q;

		if (!param) {
			res.json({
				error: "Missing required parameter `q`"
			});
			return;
		} else if (param !== "keywords") {
			res.json({
				error: "Unknown quezry"
			});
		}
		
		res.json({keywords: keywordList.keywords});
	});

	app.listen(app.get("port"), () => {
		console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
	});

}