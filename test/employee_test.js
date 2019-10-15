const assert = require("assert");
const User = require("./../models/user");

describe('demo test', function () {
    it("save a record to db", (done) => {
        let emp = User({
           name: "Test",
           email: Date.now() + "@test.com",
           mobile: "01003939111",
           password: "password",
        });

        User.saveUser(emp, (err, user) => {
            assert(user.isNew === false);
            done();
        });
    });


    it("update one record to db", (done) => {
       User.findOne({ name: "Test" }, (result) => {
           assert(result === null);
           done();
       })
    });
});