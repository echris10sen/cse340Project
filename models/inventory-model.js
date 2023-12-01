const { check } = require("express-validator");
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
            ON i.classification_id = c.classification_id 
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        console.log(data.rows);
        return data.rows
    } catch (error) {
        console.error(`getclassificationbyid error ${error}`)
    }
}


/*************************************
 * Get inventory items by inv_id
 * ***********************************/
async function getInventoryByInvId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory
            WHERE inv_id = $1`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error(`getInventoryByInvId error ${error}`);
    }
}


/*************************************
 * Add classification
 * ***********************************/
async function addClassification(classification_name) {
    try {
        const sql = `INSERT INTO classification (
            classification_name
        ) VALUES (
            $1
        ) RETURNING *`
        return await pool.query(sql, [classification_name])
    } catch (error) {
        console.error(`addClassification error ${error}`);
    }
    
}

/*************************************
 * Add inventory
 * ***********************************/
async function addInventory(
    inv_make,
    inv_model, 
    inv_year, 
    inv_description, 
    inv_img,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,  
    classification_id
    ) {
    try {
        const sql = `INSERT INTO inventory (
            inv_make,
            inv_model, 
            inv_year, 
            inv_description, 
            inv_img,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,  
            classification_id
        ) VALUES (
            $1, 
            $2, 
            $3, 
            $4, 
            $5, 
            $6, 
            $7, 
            $8,
            $9,
            $10
        ) RETURNING *`
        return await pool.query(sql, [
            inv_make,
            inv_model, 
            inv_year, 
            inv_description, 
            inv_img,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,  
            classification_id
        ])
    } catch (error) {
        console.error(`addInventory error ${error}`);
    }
    
}

/*************************************
 * Check existing classification name
 * ***********************************/
async function checkExistingName(classification_name){
    try {
        const sql = 'SELECT * FROM classification WHERE classification_name = $1'
        const name = await pool.query(sql, [classification_name])
        return name.rowCount
    } catch (error) {
        return error.message
    }
}
module.exports = { 
    addClassification,
    addInventory,
    checkExistingName,
    getClassifications, 
    getInventoryByClassificationId, 
    getInventoryByInvId 
}