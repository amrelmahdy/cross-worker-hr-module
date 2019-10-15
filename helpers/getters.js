module.exports = {
    createResponse: (status, token, code, validation, desc, response) => {
        return {
            status: status,
            code: code,
            token: token,
            desc: desc,
            errors: validation,
            data: response
        }
    },

};



