const express = require('express')

// const db = require('../data/dbConfig')
const Project = require('../data/helpers/projectModel')

const actionRouter = require('../server/actions/actionsRouter')

const router = express.Router()

router.use(express.json())

//GET ALL PROJECTS
router.get('/', (req, res) => {
    Project.get()
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            res.status(500).json({error: "Couldnt get all projects"})
        })
})


//GET PROJECT BY ID
router.get('/:id', validateProjectId, (req, res) => {
    const { id } = req.params
    Project.get(id)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: `No project with id of ${id}`})
        })
})


///CREATE PROJECT
router.post('/', validateProjectResource, (req, res)=> {
    Project.insert(req.body)
        .then(add => {
            res.status(201).json(add)
        })
        .catch(err => {
            res.status(500).json({Error: "Error adding new project"})
        })
})


///DELETE A PROJECT
router.delete('/:id', validateProjectId, ( req, res)=> {
    const { id } = req.params
    Project.remove(id)
        .then(deleted => {
            res.status(200).json({ recordsDeleted: deleted})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "Error deleting project"})
        })
})


///UPDATE PROJECT BY ID
router.put('/:id', validateProjectId, validateProjectResource,(req, res)=> {
    Project.update(req.params.id, req.body)
        .then( update => res.status(202).json( update))
        .catch(err => {
            console.log(err)
            res.status(500).json({err: "Error updating the specific project"})
        })
})

//middleware
function validateProjectResource(req, res, next) {
    if (req.body.name === undefined) {
      res.status(400).json({
        errorMessage: "Make sure your project has name field"
      });
    } else if (req.body.description === undefined) {
      res.status(400).json({
        errorMessage: "Make sure your project has description field"
      });
    } else {
      next();
    }
  }

  function validateProjectId(req, res, next) {
    Project.get(req.params.id)
      .then(project => {
        if (project) {
          next();
        } else {
          res.status(400).json({ errorMessage: "Invalid Project ID" });
        }
      })
      .catch(() =>
        res.status(500).json({ errorMessage: "Error with accessing Projects" })
      );
  }


///GET ALL ACTIONS FOR A PROJECT
router.get('/:id/actions', validateProjectId, (req,res)=> {
  Project.getProjectActions(req.params.id)
    .then(actions => {
      res.status(200).json(actions)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "Error getting all actions for a project"})
    })
})

module.exports = router