const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const connectDB = require('./Config/db');
const port = process.env.PORT || 5000;
const { errorHandler } = require('./MiddeleWare/errorMiddeleware');
var cors = require('cors')
const bodyParser = require('body-parser');
connectDB();
const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use((req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content-Type, Accepnt, Authorization'
//     );
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
//   });

app.use('/user', require('./routes/userRoutes'));
app.use('/doctor', require('./routes/doctorRoutes'));
app.use('/appoinment', require('./routes/appoinmentRoutes'));
app.use('/api/rate', require('./routes/rateRoutes'));
app.use('/slot', require('./routes/slotRoutes'));
app.use('/video', require('./routes/videoRoutes'));
app.use(errorHandler);

app.listen(port, () => {
    console.log('Server stated on port: ' + port.green)
});