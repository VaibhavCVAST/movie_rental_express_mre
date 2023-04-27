const verifyAdmin = (req,res,next) => {
    if(!req.user.isAdmin) return res.status(401).send('Access Forbidden')
    next()
}

module.exports.admin = verifyAdmin