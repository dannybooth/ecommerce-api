const pool = require('../config/db');

const getOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        let ordersResult = await pool.query(
            `SELECT orders.id AS order_id, orders.total AS order_total, orders.status AS order_status,
                orderitems.id AS item_id, orderitems.product_id AS product_id, orderitems.quantity AS quantity, 
                orderitems.price AS item_price, products.name AS product_name
            FROM orders
            LEFT JOIN orderitems ON orders.id = orderitems.order_id
            LEFT JOIN products ON orderitems.product_id = products.id
            WHERE orders.user_id = $1`,
            [userId]
        );

        if (ordersResult.rows[0].order_id === null) {
            // If no orders or items exist, return a response indicating no orders exist
            return res.status(200).json({ message: 'You have no orders at this time.' });
        }

        const ordersMap = {};
        ordersResult.rows.forEach(row => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    orderId: row.order_id,
                    orderTotal: row.order_total,
                    orderStatus: row.order_status,
                    items: []
                };
            }
            ordersMap[row.order_id].items.push({
                itemId: row.item_id,
                productId: row.product_id,
                productName: row.product_name,
                itemPrice: row.item_price,
                quantity: row.quantity
            });
        });

        const orders = Object.values(ordersMap);

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrderById = async (req, res) => {
    const orderId = parseInt(req.params.orderId);

    try {
        let ordersResult = await pool.query(
            `SELECT orders.id AS order_id, orders.total AS order_total, orders.status AS order_status,
                orderitems.id AS item_id, orderitems.product_id AS product_id, orderitems.quantity AS quantity, 
                orderitems.price AS item_price, products.name AS product_name
            FROM orders
            LEFT JOIN orderitems ON orders.id = orderitems.order_id
            LEFT JOIN products ON orderitems.product_id = products.id
            WHERE orders.id = $1`,
            [orderId]
        );

        if (ordersResult.rows.length === 0 || ordersResult.rows[0].order_id === null) {
            // If no orders or items exist, return a response indicating no orders exist
            return res.status(200).json({ message: 'You have no orders at this time.' });
        }

        const orderItems = ordersResult.rows.map(row => ({
            itemId: row.item_id,
            productId: row.product_id,
            productName: row.product_name,
            itemPrice: row.item_price,
            quantity: row.quantity
        }));

        const orderData = {
            orderId: ordersResult.rows[0].order_id,
            items: orderItems,
            orderTotal: ordersResult.rows[0].order_total,
            orderStatus: ordersResult.rows[0].order_status
        };

        res.status(200).json(orderData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

module.exports = {
    getOrders,
    getOrderById
};