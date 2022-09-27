const jwt = require('jsonwebtoken')

const createToken = (user) => {
    const data = {
        user: {
            id: user.id,
            name: user.username,
            role: user.role,
            phone: user.phone,
            email: user.email,
            address: user.address,
            businessName: user.businessName,
            isSellerVerified : user.isSellerVerified,
            warrantyAddress : user.warrantyAddress,
            sellerAddress : user.sellerAddress
        }
    }
    const authToken = jwt.sign(data, process.env.JWT_SECRET)
    return authToken
}

module.exports = createToken
