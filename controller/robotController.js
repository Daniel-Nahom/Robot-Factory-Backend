const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = low(adapter);
const isEmpty = require('lodash.isempty');

rotateLeft = (heading) => {
  switch (heading) {
    case 'NORTH':
      return 'WEST';
    case 'EAST':
      return 'NORTH';
    case 'SOUTH':
      return 'EAST';
    case 'WEST':
      return 'SOUTH';
  }
};

rotateRight = (heading) => {
  switch (heading) {
    case 'NORTH':
      return 'EAST';
    case 'EAST':
      return 'SOUTH';
    case 'SOUTH':
      return 'WEST';
    case 'WEST':
      return 'NORTH';
    default:
      return heading;
  }
};

moveForward = (robot) => {
  switch (robot.heading) {
    case 'NORTH':
      robot.posY++;
      break;
    case 'EAST':
      robot.posX++;
      break;
    case 'SOUTH':
      robot.posY--;
      break;
    case 'WEST':
      robot.posX--;
      break;
    default:
      null;
  }
  return {
    posX: robot.posX,
    posY: robot.posY,
  };
};

exports.getRobots = (req, res, next) => {
  try {
    const robots = db.get('robots').value();
    res.status(200).send(robots);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.addRobot = (req, res, next) => {
  try {
    //check req.body (robot name , title,..) is empty , then respond err
    if (isEmpty(req.body)) {
      const error = new Error('INVALID REQUEST MESSAGE');
      //BAD REQUEST
      error.status = 400;
      //SET STACK TO NULL
      error.stack = null;
      next(error);
    } else {
      const robot = req.body;
      console.log(req.body);
      db.get('robots')
        .push(robot)
        .last()
        .assign({
          id: Date.now().toString(),
          posX: 0,
          posY: 0,
          heading: 'NORTH',
        })
        .write();
      res.status(201).send(robot);
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteRobot = (req, res) => {
  const robotName = req.body.name;
  const robotId = req.body.id;
  db.get('robots').remove({ id: robotId }).write();
  res.status(200).send(`${robotName} was removed successfully`);
};

exports.rotateLeft = (req, res) => {
  const robotId = req.body.id;
  const robot = db.get('robots').find({ id: robotId }).value();
  db.get('robots')
    .find({ id: robotId })
    .assign({
      heading: rotateLeft(robot.heading),
    })
    .write();
  res.status(200).send(robot);
};

exports.rotateRight = (req, res) => {
  const robotId = req.body.id;
  const robot = db.get('robots').find({ id: robotId }).value();
  db.get('robots')
    .find({ id: robotId })
    .assign({
      heading: rotateRight(robot.heading),
    })
    .write();
  res.status(200).send(robot);
};

exports.moveForward = (req, res) => {
  const robotId = req.body.id;
  let robot = db.get('robots').find({ id: robotId }).value();
  let robotDirection = moveForward(robot);
  db.get('robots')
    .find({ id: robotId })
    .assign({
      posX: robotDirection.posX,
      posY: robotDirection.posY,
    })
    .write();
  res.status(200).send(robot);
};
