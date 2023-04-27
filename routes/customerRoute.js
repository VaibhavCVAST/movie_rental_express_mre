const express = require('express')
const router = express.Router()
const { Customer, validateCustomer } = require('../models/customer')
const auth = require('../middlewares/auth')
const {admin} = require('../middlewares/admin')

router.get('/',async(req,res)=>{
    const customer = await Customer.find()
    res.status(200).send(customer)
})

router.get('/:id',auth,async(req,res)=>{
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(404).send('Customer with given id not found')
    res.status(200).send(customer)
})

router.post('/',async (req,res)=>{
    const {error} = validateCustomer(req.body)
    // console.log("this is error :- ",error)
    if(error) return res.status(400).send(error.details[0].message)
    const {name,phone,isGold} = req.body
    const customer = new Customer({
        name,
        phone, 
        isGold
    })
    await customer.save()
    res.status(200).send(customer)
})

router.put('/:id',auth,async(req,res)=>{
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(404).send('Customer with given id not found')
    const {error} = validateCustomer(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const {name,phone,isGold} = req.body
    const updateCustomer = await  Customer.findByIdAndUpdate(
        req.params.id,{
        name,
        phone,
        isGold
    },{new:true}
    )
    await updateCustomer.save()
    res.status(200).send(updateCustomer)
})

router.delete('/:id',auth,admin,async(req,res)=>{
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if(!customer) return res.status(404).send('Cusomer with given id not found')
    res.status(200).send(customer)
})

module.exports = router;