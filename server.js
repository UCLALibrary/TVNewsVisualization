const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
}

app.get("/api/food", (req, res) => {
	const param = req.query.q;

	if (!param) {
		res.json({
			error: "Missing required parameter `q`"
		});
		return;
	}
	
	res.json({keywords: KEYWORDS});
});

app.listen(app.get("port"), () => {
	console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});

const KEYWORDS = [
	{
		word: 'ucla',
		count: 10000,
	}, {
		word: 'hello',
		count: 10600,
	}, {
		word: 'bed',
		count: 1000,
	}, {
		word: 'left',
		count: 870,
	}, {
		word: 'random',
		count: 200,
	}
];