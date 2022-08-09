import { Router } from "express";
import { Essay } from "./models";

let router = Router();

router.get("/essays", async (req, res) => {
    res.send(await Essay.find({ name: req.query.studentName || "" }));
});

router.post("/comment", async (req, res) => {
    await Essay.findOneAndUpdate({_id: req.body._id}, {comment: req.body.comment});
    console.log(req.body)
    console.log(await Essay.findOne({_id: req.body._id}))
    res.sendStatus(200);
});

export default router;