const express = require('express');
//create a new Router

const router = express.Router();
const {
  getRobots,
  addRobot,
  deleteRobot,
  rotateLeft,
  rotateRight,
  moveForward,
} = require('../controller/robotController');

/**
 * base path: "http://lacalhost:3001"
 * sub route: '/'
 * full endpoint : "http://localhost:3001/robots/"
 */

/**
 * GET ROBOT , CREATE ROBOT, DELETE ROBOT
 */

router.route('/')
.get(getRobots)
.post(addRobot)
.delete(deleteRobot);

router.route('/left').post(rotateLeft);
router.route('/right').post(rotateRight);
router.route('/forward').post(moveForward);

module.exports = router;
