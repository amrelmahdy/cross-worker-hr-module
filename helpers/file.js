const upload = (file, target) => {
    const fileName = Date.now() + file.name.replace(/\s/g, '');
    return new Promise((resolve, reject) => {
        file.mv(target + fileName, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve({
                    image: "/public/images/uploads/" + fileName,
                });
            }
        });
    });
};


module.exports = {
    uploadImage: upload,
};