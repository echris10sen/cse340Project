-- Step 1
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Step 2
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Step 3
DELETE FROM account
WHERE account_id = 1;
-- Step 4
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-- Step 5
SELECT inv_make,
    inv_model,
    classification_name
FROM inventory
    INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';
-- Step 6
UPDATE inventory
SET inv_thumbnail = REGEXP_REPLACE(
        inv_thumbnail,
        'images',
        'images/vehicles'
    );