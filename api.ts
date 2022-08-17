import { Router } from "express";
import { findBestMatch } from "string-similarity";
import { Essay } from "./models";

let router = Router();

router.get("/essays", async (req, res) => {
    let essays = await Essay.find({ name: req.query.studentName || "" });
    let possibility: string = "";
    if (!essays.length) {
        let bestMatch = findBestMatch(req.query.studentName as string, (await Essay.find()).map(essay => essay.name || "")).bestMatch;
        if (bestMatch.rating >= 0.75) {
            possibility = bestMatch.target;
        }
    }
    res.send({
        essays: essays,
        possibility: possibility
    });
});

router.post("/comment", async (req, res) => {
    await Essay.findOneAndUpdate({_id: req.body._id}, {comment: req.body.comment});
    res.sendStatus(200);
});

export default router;