const pool = require("../database/")

/***********************************
 * Get all classification data
 ***********************************/
async function getClassifications() {
    try {
        return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")    
    } catch (error) {
        console.error(`getClassifications error ${error}`)
    }
    
}

/*************************************
 * Get all inventory items and 
 * classification_name by 
 * classification_id
 *************************************/
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = $1 
            AND i.classification_id = c.classification_id`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error(`getclassificationbyid error ${error}`)
    }
}

module.exports = { getClassifications, getInventoryByClassificationId }