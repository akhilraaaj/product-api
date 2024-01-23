const express = require("express")
const router = express.Router()
const { nanoid } = require("nanoid")

const idLength = 5;

/**
 * @swagger
 * components: 
 *  schemas:
 *      Product:
 *        type: object
 *        required:
 *          -name
 *          -category
 *          -price
 *        properties:
 *          id:
 *            type: string
 *            description: The auto-generated id of the product
 *          name:
 *            type: string
 *            description: The product name
 *          category:
 *            type: string
 *            description: The product category
 *          price:
 *            type: number
 *            description: The product price
 *        example:
 *            id: ABC3D
 *            name: Laptop
 *            category: Electronics
 *            price: 999.99
 *            quantity: 50
 */

 /**
  * @swagger
  * tags:
  *   name: Products
  *   description: The product inventory management API
  */

 /**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns the list of all the products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */


router.get("/", (req, res) => {
    const products = req.app.db.get("products")
    res.send(products);
})

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */

router.get("/:id", (req, res) => {
    const product = req.app.db.get("products").find({ id: req.params.id }).value()
    if(!product){
        res.sendStatus(404)
      }
    res.send(product);
})

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res) => {
    try {
        const product = {
            id: nanoid(idLength),
            ...req.body
        }
        req.app.db.get("products").push(product).write()
        res.send(product)
    } catch (error) {
        return res.status(500).send(error);
    }
})

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update the product by the id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Some error happened
 */


router.put("/:id", (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = req.app.db
            .get("products")
            .find({ id: productId })
            .assign(req.body)
            .write();

        res.send(updatedProduct);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 * 
 *     responses:
 *       200:
 *         description: The product was deleted
 *       404:
 *         description: The product was not found
 */

router.delete("/:id", (req, res) => {
    req.app.db.get("products").remove({ id: req.params.id }).write()

    res.sendStatus(200)
})

module.exports = router;