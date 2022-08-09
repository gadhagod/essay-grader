import express from "express";
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import Grader from "./grader";
import { Essay } from "./models";
import api from "./api"

const app = express();
const port = 2020;

(global as any).base = __dirname;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use("/assets", express.static(__dirname + "/views/assets"));

(async () => {
    await mongoose.connect('mongodb://localhost:27017/essays');

    app.get("/", async (_req, res) => {
        res.redirect("/dashboard/teacher");
    });

    app.get("/dashboard/student", async (_req, res) => {
        res.render("dashboard/student.ejs");
    });

    app.get("/dashboard/teacher", async (_req, res) => {
        res.render("dashboard/teacher.ejs", { essays: await Essay.find() });
    });

    app.get("/view/:essayId", async (req, res) => {
        try {
            let essayData = await Essay.findOne({ _id: req.params.essayId }) as object;
            if (essayData) res.render("view.ejs", Object.assign(
                essayData, 
                { toTitleCase: (str: string) => str.toLowerCase().split(" ").map((word) => (word.charAt(0).toUpperCase() + word.slice(1))).join(" ") },
                { admin: req.query.admin || false }
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

    app.delete("/delete/:essayId", async (req, res) => {
        await Essay.deleteOne({_id: req.params.essayId});
        res.sendStatus(200);
    });
    
    app.use("/api", api);

    app.listen(port, () => { console.log(`App listening on port ${port}`) });
})();