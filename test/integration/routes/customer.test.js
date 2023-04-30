const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../index");
const req = supertest(app);
const { Customer } = require("../../../models/customer");
const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
// const config = require("config");
const Joi = require("joi");

describe("/customer", () => {
  afterEach(async () => {
    await Customer.deleteMany({});
  });
  //!------------------------
  describe("get/", () => {
    //---1
    it("Should return all customers in database", async () => {
      const customer = new Customer({
        name: "Vaibhav",
        phone : "1234567890",
        isGold : true
      });
      customer.save();
      const res = await req.get("/customer");
      expect(customer).toHaveProperty("name", "Vaibhav","phone","1234567890","isGold","true");
      // expect(res.body.some((g)=>g.name === "genre1")).toBeTruthy()
      // expect(res.body.some((g)=>g.name === "genre2")).toBeTruthy()
    });
  });


  //!-------END
});
