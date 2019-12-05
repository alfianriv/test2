const express = require('express');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const Sequelize = require('sequelize');
dotenv.config();


let sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    dialect: 'mariadb',
    dialectOptions: {
        multipleStatements: true
    }
})

let Items = sequelize.define('items', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    fullname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    item: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    total_price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

Items.sync();

let app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.get('/generateData', async (req, res) => {
    let data = await axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
        response = response.data;
        let randomFrom = [0, 5];
        let randoms = randomFrom[Math.floor(Math.random() * randomFrom.length)];
        let users = response.splice(randoms, 5);
        let min = 1;
        let max = 10;

        let result = users.map(array => {
            return {
                fullname: array.name,
                email: array.email,
                item: 'Barang' + Math.floor(Math.random() * (max - min) + min),
                quantity: Math.floor(Math.random() * (max - min) + min),
                total_price: Math.floor(Math.random() * (max - min) + min) * 100000
            }
        });

        return {
            success: true,
            data: result
        }
    }).catch(err => {
        return {
            success: false,
        }
    });

    if (!data.success) {
        res.json({
            success: false
        })
        return
    }

    Items.bulkCreate(data.data).then(result => {
        if(result.length > 0){
            res.json({
                success: true
            })
        }else{
            res.json({
                success: false
            })
        }
    }).catch(err => {
        res.json({
            success: false
        })
    })
});

app.get('/getDataPivot', async (req, res) => {
    let result = await Items.findAll().then(result => result);

    if(result.length <= 0){
        res.json({success: false})
        return;
    }

    let query = [
        'SET @QUERY = NULL;',
        "SELECT GROUP_CONCAT( DISTINCT CONCAT ( 'sum(case when item = ''', item, ''' then quantity else 0 end) AS ', item ) ) INTO @QUERY FROM items;",
        "SET @QUERY = CONCAT('SELECT email, fullname, ', @QUERY, ' FROM items GROUP BY email');",
        "PREPARE stmt FROM @QUERY;",
        "EXECUTE stmt;",
        "DEALLOCATE PREPARE stmt;"
    ].join(' ');

    sequelize.query(query, {
        raw: true
    }).then(rows => {
        res.json({success: true, data: rows[0][4]});
    })

})

app.get('/getDataRaw', async(req, res) => {
    await Items.findAll().then(result => {
        res.json({success: true, data: result});
    });
})

app.listen(3000);