require("dotenv").config();
const express = require("express");
const { ScrappingRoutes } = require("./routes/scrappingRoutes");

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use("/scrap", ScrappingRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Scrapper server started on port ${PORT}`);
});