import { Router } from "express";
import { Essay } from "./models";

let router = Router();

router.get("/essays", async (req, res) => {
    res.send(await Essay.find({ name: req.query.studentName || "" }));
});

export default router;