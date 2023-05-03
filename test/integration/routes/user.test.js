const supertest = require("supertest");
const config = require("config");
const mongoose = require("mongoose");
const app = require("../../../index");
const req = supertest(app);
const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const Joi = require("joi");


describe('/user',()=>{
    afterEach(async () => {
        await User.deleteMany({});
      });
      //!-----------------------
      describe("get/", () => {
        //---1
        it("Should return all users in database", async () => {
          const user = new User({
            name: "Vaibhav",
            email: "vaibhavc@gmail.com",
            password : "1234567890",
            isAdmin : true
          });
          user.save();
          const res = await req.get("/user");
          expect(user).toHaveProperty(
            "name","Vaibhav","email","vaibhavc@gmail.com",
            "password","1234567890","isAdmin","true"
          );
        });
      });
      //!-----------------------
      describe("get/:id", () => {
        //---2
        it("should return user with specified id", async () => {
          const token = new User().getAuthToken();
          const user = new User({
            name: "Vaibhav",
            email: "vaibhavc@gmail.com",
            password : "1234567890",
            isAdmin : true
          });
          user.save();
          const res = await req
            .get("/user/" + user._id)
            .set("x-auth-token", token);
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty(
            "name","Vaibhav","email","vaibhavc@gmail.com",
            "password","1234567890","isAdmin","true"
          );
        });
        //---3
        it("should return 404 if Id not found", async () => {
          const user = new User({
            name: "Vaibhav",
            email: "vaibhavc@gmail.com",
            password : "1234567890",
            isAdmin : true
          });
          user.save();
          const id = new mongoose.Types.ObjectId();
          const res = await req.get("/user" + id.toString());
          expect(res.status).toBe(404);
        });
        //---4
        it("should return 400 if Id is invalid", async () => {
          const user = new User({
            name: "Vaibhav",
            email: "vaibhavc@gmail.com",
            password : "1234567890",
            isAdmin : true
          });
          user.save();
          const res = await req.get("/user/" + null);
          expect(res.status).toBe(400);
        });
      });
      //!-----------------------
      describe("post/", () => {
        //---5
        // it("should return 400 if valid token is not provided", async () => {
        //   const token = new User().getAuthToken();
        //   const res = await req.post("/user")
        //   .set('x-auth-token',token+"v");
        //   expect(res.status).toBe(400);
        // });
        // ---6
        // it("should return 400 if user name is less than 3 characters", async () => {
        //   const res = await req.post("/user")
        //   .send({
        //     name: "v",
        //     email: "vaibhavc@gmail.com",
        //     password : "1234567890",
        //     isAdmin : true
        //   });
        //   console.log("body is ",res.body.error)
        //   expect(res.status).toBe(400);
        //   expect(res.body.error.details.message).toBe('"name" length must be at least 3 characters long');
        // });
        // ---7
        // it("should return 400 if user name is more than 20 characters", async () => {
        //   const res = await req
        //     .post("/user")
        //     .send({ 
        //         name: "Vaibhavvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",
        //         email: "vaibhavc@gmail.com",
        //         password : "1234567890",
        //         isAdmin : true
        //      });
        //   expect(res.status).toBe(400);
        // });
        //---8
        // it("should return 400 if user password is invalid", async () => {
        //     const res = await req
        //       .post("/user")
        //       .send({ 
        //         name: "Vaibhav",
        //         email: "vaibhavc@gmail.com",
        //         password : "1234567",
        //         isAdmin : true
        //        });
        //     expect(res.status).toBe(400);
        //   });
        //---9
        // it("should return 400 if user isAdmin property is not a boolean", async () => {
        //     const res = await req
        //       .post("/user")
        //       .send({ 
        //         name: "Vaibhav",
        //         email: "vaibhavc@gmail.com",
        //         password : "1234567890",
        //         isAdmin : null
        //        });
        //     expect(res.status).toBe(400);
        //   });
        //---10
        // it("should return 400 if user Email property is invalid", async () => {
        //     const res = await req
        //       .post("/user")
        //       .send({ 
        //         name: "Vaibhav",
        //         email: "vaibhavc@gmailcom",
        //         password : "1234567890",
        //         isAdmin : true
        //        });
        //     expect(res.status).toBe(400);
        //   });
        //---10
        // it("should return 200 and create user", async () => {
        //   const res = await req
        //     .post("/user")
        //     .send({
        //         name: "Vaibhav",
        //         email: "vaibhavchowdhary@gmail.com",
        //         password : "1234567890",
        //         isAdmin : true
        //     })
        //   expect(res.status).toBe(200);
        // });
      });
      //!-----------------------
      describe("put/:id", () => {
        //---11
        it("return 404 if id is null", async () => {
          const res = await req.put("/user" + null);
          expect(res.status).toBe(404);
        });
        //---12
        it("return 400 if id is invalid", async () => {
          const id = new mongoose.Types.ObjectId();
          const res = await req.put("/user/" + id.toString());
          expect(res.status).toBe(400);
        });
        //---13
        it("should return 200 if user updated", async () => {
          const token = jwt.sign(
            {
              _id: new mongoose.Types.ObjectId(),
              isAdmin: false,
            },
            config.get("password")
          );
          const user = new User({
            name: "Vaibhav",
            email: "vaibhavc@gmail.com",
            password : "1234567890",
            isAdmin : true
          });
          user.save();
          const res = await req
            .put("/user/" + user._id.toString())
            .send({ name: "VaibhavGC", email : "vaibhav@gmail.com",password: "0987654321", isAdmin: false })
            .set("x-auth-token", token);
          expect(res.status).toBe(200);
        });
        //---14
        it("should return 401 if invalid jwt token(unauthorized)", async () => {
          const token = new User().getAuthToken();
          const user = new User({
            name: "Vaibhav",
            email: "vaibhavc@gmail.com",
            password : "1234567890",
            isAdmin : true
          });
          user.save();
          const res = await req
            .delete("/user/" + user._id)
            .set("x-auth-token", token + "v");
          expect(res.status).toBe(401);
        });
      });
      //!-----------------------
      describe("delete/:id", () => {
        //---15
        it("should return 400 if Id is invalid", async () => {
          const user = new User({
            name: "Vaibhav",
            email: "vaibhavc@gmail.com",
            password : "1234567890",
            isAdmin : true
          });
          user.save();
          const res = await req.delete("/user/" + 1234);
          expect(res.status).toBe(400);
        });
        //---16
        it("should return 404 if Id not found or null", async () => {
          const user = new User({
            name: "Vaibhav",
            email: "vaibhavc@gmail.com",
            password : "1234567890",
            isAdmin : true
          });
          user.save();
          const id = new mongoose.Types.ObjectId();
          const res = await req.delete("/user" + id.toString());
          expect(res.status).toBe(404);
        });
        //---17
        it("should return 401 if unauthorized", async () => {
          const token = new User().getAuthToken();
          const user = new User({
            name: "Vaibhav",
            email: "vaibhavc@gmail.com",
            password : "1234567890",
            isAdmin : true
          });
          user.save();
          const res = await req
            .delete("/user/" + user._id)
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
          const user = new User({
            name: "Vaibhav",
            email: "vaibhavc@gmail.com",
            password : "1234567890",
            isAdmin : true
          });
          user.save();
          const res = await req
            .delete("/user/" + user._id)
            .set("x-auth-token", token);
          expect(res.status).toBe(403);
        });
        //---19
        it("should return 200 after deleting user", async () => {
          const token = jwt.sign(
            {
              _id: new mongoose.Types.ObjectId(),
              isAdmin: true,
            },
            config.get("password")
          );
          const user = new User({
            name: "Vaibhav",
            email: "vaibhavc@gmail.com",
            password : "1234567890",
            isAdmin : true
          });
          user.save();
          const res = await req
            .delete("/user/" + user._id)
            .set("x-auth-token", token);
          expect(res.status).toBe(200);
        });
        //---20
        it("should delete user if input is valid", async () => {
          const token = jwt.sign(
            {
              _id: new mongoose.Types.ObjectId(),
              isAdmin: true,
            },
            config.get("password")
          );
          const user = new User({
            name: "Vaibhav",
            email: "vaibhavc@gmail.com",
            password : "1234567890",
            isAdmin : true
          });
          await user.save();
          await req.delete("/user/" + user._id).set("x-auth-token", token);
          const deleteUser = await User.findById(user._id);
          expect(deleteUser).toBeNull();
        });
        //---21
        it("should return 404 if user with given id is not found", async () => {
          const token = jwt.sign(
            {
              _id: new mongoose.Types.ObjectId(),
              isAdmin: true,
            },
            config.get("password")
          );
          const id = new mongoose.Types.ObjectId();
          const res = await req.delete("/user" + id).set("x-auth-token", token);
          expect(res.status).toBe(404);
        });
      });
})