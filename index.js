const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const productsRouter = require("./routes/products");

const SERVER_PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ products: [] }).write();

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Product Management API",
            version: "1.0.0",
            description: "An Express Product Management API with CRUD Operations"
        },
        servers: [
            {
                url: "http://localhost:4000"
            }
        ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use(express.static(path.join(__dirname, './build')));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.use("/products", productsRouter);

app.listen(SERVER_PORT, () => console.log(`The server is running on port ${SERVER_PORT}`));
