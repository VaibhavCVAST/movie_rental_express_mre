const supertest = require("supertest");
const config = require("config");
const mongoose = require("mongoose");
const app = require("../../../index");
const req = supertest(app);
const { Customer } = require("../../../models/customer");
const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
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
        phone: "1234567890",
        isGold: true,
      });
      customer.save();
      const res = await req.get("/customer");
      expect(customer).toHaveProperty(
        "name",
        "Vaibhav",
        "phone",
        "1234567890",
        "isGold",
        "true"
      );
    });
  });
  //!--------------------------
  describe("get/:id", () => {
    //---2
    it("should return customer with specified id", async () => {
      const token = new User().getAuthToken();
      const customer = new Customer({
        name: "Vaibhav",
        phone: "1234567890",
        isGold: true,
      });
      customer.save();
      const res = await req
        .get("/customer/" + customer._id)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "name",
        "Vaibhav",
        "phone",
        "1234567890",
        "isGold",
        "true"
      );
    });
    //---3
    it("should return 404 if Id not found", async () => {
      const customer = new Customer({
        name: "Vaibhav",
        phone: "1234567890",
        isGold: true,
      });
      customer.save();
      const id = new mongoose.Types.ObjectId();
      const res = await req.get("/customer" + id.toString());
      expect(res.status).toBe(404);
    });
    //---4
    it("should return 400 if Id is invalid", async () => {
      const customer = new Customer({
        name: "Vaibhav",
        phone: "1234567890",
        isGold: true,
      });
      customer.save();
      const res = await req.get("/customer/" + null);
      expect(res.status).toBe(400);
    });
  });
  //!-----------------------------=
  describe("post/", () => {
    //---5
    // it("should return 401 if valid token is not provided", async () => {
    //   const token = new User().getAuthToken();
    //   const res = await req.post("/customer/")
    //   .send({
    //       name: "Vaibhav",
    //       phone: "1234567890",
    //       isGold: true,
    //   })
    //   .set('x-auth-token',token+"123");
    //   expect(res.status).toBe(401);
    // });
    // ---6
    it("should return 400 if customer name is less than 3 characters", async () => {
      const res = await req.post("/customer")
      .send({
          name: "Va",
          phone: "1234567890",
          isGold: true,
      });
      console.log("body is ",res.body.error)
      expect(res.status).toBe(400);
    //   expect(res.body.error.details.message).toBe('"name" length must be at least 3 characters long');
    });
    // ---7
    it("should return 400 if customer name is more than 20 characters", async () => {
      const res = await req
        .post("/customer")
        .send({ 
          name: "Vaibhavvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",
          phone: "1234567890",
          isGold: true,
         });
      expect(res.status).toBe(400);
    });
    //---8
    it("should return 400 if customer phone length is not equal to 10 characters", async () => {
        const res = await req
          .post("/customer")
          .send({ 
            name: "Vaibhav",
            phone: "12345678",
            isGold: true,
           });
        expect(res.status).toBe(400);
      });
    //---9
    it("should return 400 if customer isGold property is not a boolean", async () => {
        const res = await req
          .post("/customer")
          .send({ 
            name: "Vaibhav",
            phone: "12345678",
            isGold: null,
           });
        expect(res.status).toBe(400);
      });
    //---10
    it("should return 200 and create customer", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .post("/customer")
        .send({
          name: "Vaibhav",
          phone: "1234567890",
          isGold: true,
        })
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });
  //!------------------------------
  describe("put/:id", () => {
    //---11
    it("return 404 if id is null", async () => {
      const res = await req.put("/customer" + null);
      expect(res.status).toBe(404);
    });
    //---12
    it("return 400 if id is invalid", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.put("/customer/" + id.toString());
      expect(res.status).toBe(400);
    });
    //---13
    it("should return 200 if customer updated", async () => {
      const token = jwt.sign(
        {
          _id: new mongoose.Types.ObjectId(),
          isAdmin: false,
        },
        config.get("password")
      );
      const customer = new Customer({
        name: "Vaibhav",
        phone: "1234567890",
        isGold: true,
      });
      customer.save();
      const res = await req
        .put("/customer/" + customer._id.toString())
        .send({ name: "VaibhavGC", phone: "0987654321", isGold: true })
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
    //---14
    it("should return 401 if invalid jwt token(unauthorized)", async () => {
      const token = new User().getAuthToken();
      const customer = new Customer({
        name: "Vaibhav",
        phone: "1234567890",
        isGold: true,
      });
      customer.save();
      const res = await req
        .delete("/customer/" + customer._id)
        .set("x-auth-token", token + "v");
      expect(res.status).toBe(401);
    });
  });
  //!------------------------------
  describe("delete/:id", () => {
    //---15
    it("should return 400 if Id is invalid", async () => {
      const customer = new Customer({
        name: "Vaibhav",
        phone: "1234567890",
        isGold: true,
      });
      customer.save();
      const res = await req.delete("/customer/" + 1234);
      expect(res.status).toBe(400);
    });
    //---16
    it("should return 404 if Id not found or null", async () => {
      const customer = new Customer({
        name: "Vaibhav",
        phone: "1234567890",
        isGold: true,
      });
      customer.save();
      const id = new mongoose.Types.ObjectId();
      const res = await req.delete("/customer" + id.toString());
      expect(res.status).toBe(404);
    });
    //---17
    it("should return 401 if unauthorized", async () => {
      const token = new User().getAuthToken();
      const customer = new Customer({
        name: "Vaibhav",
        phone: "1234567890",
        isGold: true,
      });
      customer.save();
      const res = await req
        .delete("/customer/" + customer._id)
        .set("x-auth-token", token + "v");
      expect(res.status).toBe(401);
    });
    //---18
    it("should return 403 if access forbidden", async () => {
      const token = jwt.sign(
        {
          _id: new mongoose.Types.ObjectId(),
          isAdmin: false,
        },
        config.get("password")
      );
      const customer = new Customer({
        name: "Vaibhav",
        phone: "1234567890",
        isGold: true,
      });
      customer.save();
      const res = await req
        .delete("/customer/" + customer._id)
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });
    //---19
    it("should return 200 after deleting customer", async () => {
      const token = jwt.sign(
        {
          _id: new mongoose.Types.ObjectId(),
          isAdmin: true,
        },
        config.get("password")
      );
      const customer = new Customer({
        name: "Vaibhav",
        phone: "1234567890",
        isGold: true,
      });
      customer.save();
      const res = await req
        .delete("/customer/" + customer._id)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
    //---20
    it("should delete customer if input is valid", async () => {
      const token = jwt.sign(
        {
          _id: new mongoose.Types.ObjectId(),
          isAdmin: true,
        },
        config.get("password")
      );
      const customer = new Customer({
        name: "Vaibhav",
        phone: "1234567890",
        isGold: true,
      });
      await customer.save();
      await req.delete("/customer/" + customer._id).set("x-auth-token", token);
      const deletdCustomer = await Customer.findById(customer._id);
      expect(deletdCustomer).toBeNull();
    });
    //---21
    it("should return 404 if customer with given id is not found", async () => {
      const token = jwt.sign(
        {
          _id: new mongoose.Types.ObjectId(),
          isAdmin: true,
        },
        config.get("password")
      );
      const id = new mongoose.Types.ObjectId();
      const res = await req.delete("/customer" + id).set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
  });
  //!-----------------------------
  //!-------END
});
