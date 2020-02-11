const express = require("express");

const database = require("../data/db");

const router = express.Router();

// /api/posts
router.get("/", (req, res) => {
  database
    .find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved" });
    });
});

// /api/posts/:id
router.get("/:id", (req, res) => {
  database
    .findById(req.params.id)
    .then(posts => {
      if (posts.length !== 0) {
        res.status(200).json(posts);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved" });
    });
});

// /api/posts/:id/comments
router.get("/:id/comments", (req, res) => {
  database
    .findPostComments(req.params.id)
    .then(posts => {
      if (posts.length !== 0) {
        res.status(200).json(posts);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved" });
    });
});

module.exports = router;
