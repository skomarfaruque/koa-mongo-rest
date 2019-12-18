"use strict";
const category = require('../Schema/category');
const product = require('../Schema/product');
const store = require('../Schema/store');
const order = require('../Schema/order');
const categorySample = [
    { 
        name: "Tea",
        product: [
            {
                name: "Black Tea",
                description: "Black Tea sample description",
                price: 10,
                configurations: [
                    {
                        name: "Size",
                        isMultiple: false,
                        isMandatory: true,
                        details: [
                            {
                                title: "Small",
                                price: 10,
                                isDefault: true
                            },
                            {
                                title: "Medium",
                                price: 15,
                                isDefault: false
                            },
                            {
                                title: "Large",
                                price: 20,
                                isDefault: false
                            }
                        ]
                    },
                    {
                        name: "Sugar",
                        isMultiple: false,
                        isMandatory: true,
                        details: [
                            {
                                title: "No Sugar",
                                price: 0,
                                isDefault: false
                            },
                            {
                                title: "1 Spoon",
                                price: 0,
                                isDefault: true
                            },
                            {
                                title: "2 Spoons",
                                price: 0,
                                isDefault: false
                            },
                            {
                                title: "3 Spoons",
                                price: 0,
                                isDefault: false
                            }
                        ]
                    }
                    ]
                
            },
            {
                name: "Masala Chai",
                description: "Masala chai desc",
                price: 12,
                configurations: [
                    {
                        name: "Size",
                        isMultiple: false,
                        isMandatory: true,
                        details: [
                            {
                                title: "Small",
                                price: 12,
                                isDefault: true
                            },
                            {
                                title: "Medium",
                                price: 18,
                                isDefault: false
                            },
                            {
                                title: "Large",
                                price: 25,
                                isDefault: false
                            }
                        ]
                    },
                    {
                        name: "Sugar",
                        isMultiple: false,
                        isMandatory: true,
                        details: [
                            {
                                title: "No Sugar",
                                price: 0,
                                isDefault: false
                            },
                            {
                                title: "1 Spoon",
                                price: 0,
                                isDefault: true
                            },
                            {
                                title: "2 Spoon",
                                price: 0,
                                isDefault: false
                            },
                            {
                                title: "3 Spoon",
                                price: 0,
                                isDefault: false
                            }
                        ]
                    },
                    {
                        name: "Cardmom",
                        isMultiple: false,
                        isMandatory: false,
                        details: [
                            {
                                title: "1 piece",
                                price: 10,
                                isDefault: false
                            },
                            {
                                title: "2 pieces",
                                price: 12,
                                isDefault: false
                            },
                            {
                                title: "3 pieces",
                                price: 13,
                                isDefault: false
                            }
                        ]
                    },
                    {
                        name: "Papercorns",
                        isMultiple: false,
                        isMandatory: false,
                        details: [
                            {
                                title: "1 piece",
                                price: 5,
                                isDefault: false
                            },
                            {
                                title: "2 pieces",
                                price: 7,
                                isDefault: false
                            },
                            {
                                title: "3 pieces",
                                price: 10,
                                isDefault: false
                            }
                        ]
                    },
                    {
                        name: "Cinnamon",
                        isMultiple: false,
                        isMandatory: false,
                        details: [
                            {
                                title: "1 piece",
                                price: 5,
                                isDefault: false
                            },
                            {
                                title: "2 pics",
                                price: 7,
                                isDefault: false
                            },
                            {
                                title: "3 pics",
                                price: 10,
                                isDefault: false
                            }
                        ]
                    }
                ]
                
            },
            {
                name: "Lemon Tea",
                description: "Lemon Tea sample description",
                price: 10,
                configurations: [
                    {
                        name: "Size",
                        isMultiple: false,
                        isMandatory: true,
                        details: [
                            {
                                title: "Small",
                                price: 10,
                                isDefault: true
                            },
                            {
                                title: "Medium",
                                price: 15,
                                isDefault: false
                            },
                            {
                                title: "Large",
                                price: 20,
                                isDefault: false
                            }
                        ]
                    },
                    {
                        name: "Sugar",
                        isMultiple: false,
                        isMandatory: true,
                        details: [
                            {
                                title: "No Sugar",
                                price: 0,
                                isDefault: false
                            },
                            {
                                title: "1 Spoon",
                                price: 0,
                                isDefault: true
                            },
                            {
                                title: "2 Spoons",
                                price: 0,
                                isDefault: false
                            },
                            {
                                title: "3 Spoons",
                                price: 0,
                                isDefault: false
                            }
                        ]
                    }
                    ]
                
            }
        ] 
    },
    { 
        name: "Coffee",
        product: [
            {
                name: "Black Coffee",
                description: "Black Coffee sample",
                price: 20,
                configurations: [
                    {
                        name: "Size",
                        isMultiple: false,
                        isMandatory: true,
                        details: [
                            {
                                title: "Small",
                                price: 20,
                                isDefault: true
                            },
                            {
                                title: "Medium",
                                price: 25,
                                isDefault: false
                            },
                            {
                                title: "Large",
                                price: 30,
                                isDefault: false
                            }
                        ]
                    },
                    {
                        name: "Sugar",
                        isMultiple: false,
                        isMandatory: true,
                        details: [
                            {
                                title: "No Sugar",
                                price: 0,
                                isDefault: false
                            },
                            {
                                title: "1 Spoon",
                                price: 0,
                                isDefault: true
                            },
                            {
                                title: "2 Spoons",
                                price: 0,
                                isDefault: false
                            },
                            {
                                title: "3 Spoons",
                                price: 0,
                                isDefault: false
                            }
                        ]
                    }
                    ]
                
            },
            {
                name: "Milk Coffee",
                description: "Sample description",
                price: 30,
                configurations: [
                    {
                        name: "Size",
                        isMultiple: false,
                        isMandatory: true,
                        details: [
                            {
                                title: "Small",
                                price: 30,
                                isDefault: true
                            },
                            {
                                title: "Medium",
                                price: 35,
                                isDefault: false
                            },
                            {
                                title: "Large",
                                price: 40,
                                isDefault: false
                            }
                        ]
                    },
                    {
                        name: "Sugar",
                        isMultiple: false,
                        isMandatory: true,
                        details: [
                            {
                                title: "No Sugar",
                                price: 0,
                                isDefault: false
                            },
                            {
                                title: "1 Spoon",
                                price: 0,
                                isDefault: true
                            },
                            {
                                title: "2 Spoons",
                                price: 0,
                                isDefault: false
                            },
                            {
                                title: "3 Spoons",
                                price: 0,
                                isDefault: false
                            }
                        ]
                    },
                    {
                        name: "Configurations",
                        isMultiple: true,
                        isMandatory: false,
                        details: [
                            {
                                title: "Cardamom",
                                price: 10,
                                isDefault: false
                            },
                            {
                                title: "Cinnamon",
                                price: 15,
                                isDefault: false
                            },
                            {
                                title: "Coconut milk",
                                price: 20,
                                isDefault: false
                            },
                            {
                                title: "Vanilla extract",
                                price: 40,
                                isDefault: false
                            }
                        ]
                    }
                    ]
                
            }
        ] 
    }
];
exports.insertCategoryProduct = async() => {
    await categorySample.map(async(catVal) => {
        const catId = await category.create({name: catVal.name});
        const randStore = await store.find();
        await randStore.map(async(storeData)=> {
            await catVal.product.map(async(proVal) => {
                proVal.categoryId = catId._id;
                proVal.storeId = storeData._id;
                await product.create(proVal);
            });
        })
    });
};
exports.placeOrder = async(customerId) => {
    const randTwoProduct = await product.aggregate(
        [{ $sample: { size: 2 } }]
     );
    const randStore = await store.aggregate(
        [{ $sample: { size: 1 } }]
     );
     let orderObj = {
        customerId: customerId,
        storeId: randStore[0]._id,
        price: 1,
        paymentMethod: 1,
        orderStatus: 1,
        orderSource: 1,
        items: []
    };
     await randTwoProduct.map(async(proVal) => {
        let itemObj = {itemId: proVal._id, price: 300, fingerPrint: '123', quantity: 1, name: proVal.name, configurations: []};
        await proVal.configurations.map(async(mainConfig) => {
            let configObj = {name: mainConfig.name, configId: mainConfig._id, configItems: []};
            await mainConfig.details.map(async(subConfig) => {
                configObj.configItems.push({configItemId: subConfig._id, title: subConfig.title, price: subConfig.price});
            })
            itemObj.configurations.push(configObj)
        });
        orderObj.items.push(itemObj);
        
     });
     await order.create(orderObj)
   
};
