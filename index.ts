import express from "express";
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import Grader from "./grader";
import { Essay } from "./models";

const app = express();
const port = 2020;

(global as any).base = __dirname;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use("/static", express.static(__dirname + "/static"));

(async () => {
    await mongoose.connect('mongodb://localhost:27017/essays');

    app.get("/", async (_req, res) => {
        res.render("viewAll.ejs", { essays: await Essay.find() });
    });

    app.get("/view", async (_req, res) => {
        res.render("viewAll.ejs", { essays: await Essay.find() });
    });

    app.get("/view/:essayId", async (req, res) => {
        try {
            let essayData = await Essay.findOne({ _id: req.params.essayId }) as object;
            console.log(Object.assign(
                essayData, 
                { toTitleCase: (str: string) => str.toLowerCase().split(" ").map((word) => (word.charAt(0).toUpperCase() + word.slice(1))).join(" ") }
            ))
            if (essayData) res.render("viewOne.ejs", Object.assign(
                essayData, 
                { toTitleCase: (str: string) => str.toLowerCase().split(" ").map((word) => (word.charAt(0).toUpperCase() + word.slice(1))).join(" ") }
            ));
            else res.sendStatus(404);
        } catch (err) {
            res.sendStatus((err as any).kind === "ObjectId" ? 404 : 500)
        }
    });

    app.get("/upload", async (_req, res) => {
        res.render("upload.ejs");
    });
    
    app.post("/upload", async (req, res) => {
        let grade = (new Grader(req.body.rawEssayBody)).getGrade();
        let essayData = Object.assign(req.body, { creationTime: new Date(), grade: grade });
        let essay = new Essay(essayData);
        await essay.save();
        res.redirect(`view/${essay._id}`);
    });

    app.delete("/delete/:essayId", async (req, res) => {
        await Essay.deleteOne({_id: req.params.essayId});
        res.sendStatus(200);
    });
    
    app.listen(port, () => { console.log(`App listening on port ${port}`) });
})();