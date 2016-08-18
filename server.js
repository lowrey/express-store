const express = require("express");
const cors = require("cors");
const basicAuth = require("basic-auth");
const path = require("path");
const bodyparser = require("body-parser");
const database = require("tingodb")().Db;

const port = process.env.PORT || 3088;
const prefix = process.env.URL_PREFIX || "";
const app = express();
app.use(cors());
app.use(bodyparser.json());
const db = new database(path.resolve(__dirname, "db"), {});

const auth = (req, res, next) => {
    const unauthorized = (res) => {
        res.set("WWW-Authenticate", "Basic realm=Authorization Required");
        return res.sendStatus(401);
    };
    const user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };
    if (user.name === "admin" && user.pass === "changethis") {
        return next();
    } else {
        return unauthorized(res);
    };
};

const resolve = res => (err, result) => err ? res.json(err) : res.json(result);

app.get(prefix + "/:collection/all", auth, (req, res) => {
    let limit = req.query.limit ? Number(req.query.limit) : 100;
    const collection = db.collection(req.params.collection);
    collection.find({}, (err, items) => {
        if (err) {
            res.json(err);
        } else {
            items
                .sort({
                    _id: -1
                })
                .limit(limit)
                .toArray(resolve(res));
        }
    });
});

app.get(prefix + "/:collection/:id", auth, (req, res) => {
    const collection = db.collection(req.params.collection);
    collection.findOne({
        _id: Number(req.params.id)
    }, resolve(res))
});

app.post(prefix + "/:collection", auth, (req, res) => {
    const collection = db.collection(req.params.collection);
    collection.insert([req.body], resolve(res));
});

app.put(prefix + "/:collection/:id", auth, (req, res) => {
    const collection = db.collection(req.params.collection);
    collection.update({
        _id: Number(req.params.id)
    }, req.body, resolve(res));
});

app.delete(prefix + "/:collection/:id", auth, (req, res) => {
    const collection = db.collection(req.params.collection);
    collection.remove({
        _id: Number(req.params.id)
    }, resolve(res));
}); 

app.get("/*", auth, (req, res) => {
    res.send("welcome to the api");
});

const server = app.listen(port, () => {
    // var host = server.address().address;
    const port = server.address().port;
    console.log("This express app is listening on port:" + port);
});