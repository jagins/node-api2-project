const express = require("express");

const database = require("../data/db");

const router = express.Router();

//GET /api/posts
router.get("/", (req, res) => 
{
  database.find()
  .then(posts => 
  {
    res.status(200).json(posts);
  })
  .catch(err =>
 {
    res.status(500).json({ error: "The posts information could not be retrieved" });
  });
});

//GET /api/posts/:id
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

//GET /api/posts/:id/comments
router.get("/:id/comments", (req, res) => 
{
  database.findPostComments(req.params.id)
  .then(posts => 
  {
    if (posts.length !== 0) 
    {
      res.status(200).json(posts);
    } 
    else 
    {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
    }
  })
  .catch(error => 
  {
    res.status(500).json({ error: "The comments information could not be retrieved" });
  });
});

//POST /api/posts
router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents)
 {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post" });
  } 
  else 
  {
    database.insert(req.body)
    .then(id => 
    {
      const newPost = {
        id,
        title: req.body.title,
        contents: req.body.contents
      };

      res.status(201).json(newPost);
    })
      .catch(error => {
        res.status(500).json({error: "There was an error while saving the post to the database"});
      });
  }
});

//POST /api/posts/:id/comments
router.post("/:id/comments", (req, res) => 
{
  database.findById(req.params.id)
  .then(posts =>
  {
    if(posts.length !== 0)
    {
      if(req.body.text)
      {
        const newComment = {
          text: req.body.text, 
          post_id: req.params.id
        }
        database.insertComment(newComment)
        .then(comment =>
        {
          res.status(201).json(comment);
        })
        .catch(error =>
        {
          res.status(500).json({ error: "There was an error while saving the comment to the database" });
        })
      }
      else
      {
        res.status(400).status({ errorMessage: "Please provide text for the comment." });
      }
    }
    else
    {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  })
  .catch(error =>
  {
    res.status(500).json({ error: "The posts information could not be retrieved." });
  })
});

// PUT /api/posts/:id
router.put("/:id", (req, res) => 
{
  database.findById(req.body.id)
  .then(posts =>
  {
    if (posts !== 0) 
    {
      if (!req.body.title || !req.body.contents) 
      {
          res.status(400).json({errorMessage: "Please provide title and contents for the post."});
        }
        else 
        {
          database.update(req.params.id, req.body)
          .then(didUpdate => 
            {
               res.status(201).json(didUpdate);
            })
            .catch(error =>
            {
              res.status(500).json({ error: "The post information could not be modified." });
            });
        }
      }
      else 
      {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch(error => 
    {
      res.status(500).json({ message: "The post information could not be retrieved" });
    });
});

//DELETE /api/posts/:id
router.delete("/:id", (req, res) => 
{
  database.findById(req.params.id)
    .then(posts =>
    {
      if (posts.length !== 0) 
      {
        database.remove(req.params.id)
        .then(removed =>
        {
            res.status(200).json(removed);
        })
        .catch(error => 
        {
          res.status(500).json({error: "The was an error while saving the comment to the database"});
        });
      } 
      else 
      {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch();
});

module.exports = router;
