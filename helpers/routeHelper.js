const joi  = require("joi");

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            var result = joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).json(result.error);
            }
            if (!req.value) req.value = {};
            req.value["body"] = result.value;
            next();
        };

    },
    schemas: {
        registerSchema: joi.object().keys({
            name: joi.string().required(),
            email: joi.string().email().required(),
            mobile: joi.string().required(),
            password: joi.string().required(),
        })
    }
};