const express = require('express')
const router = express.Router()

const sensorService = require('service/sensor-service')

router.get('/', (req, res, next) => 
    sensorService.getAllSensors()
        .then((result) => res.json(result))
        .catch(next)
)

module.exports = router