const bcrypt = require("bcrypt");

const hasingPassword = (plantext, saltrounds) => {
    const salt = bcrypt.genSaltSync(saltrounds);
    return bcrypt.hashSync(plantext, salt);
}
module.exports = hasingPassword;