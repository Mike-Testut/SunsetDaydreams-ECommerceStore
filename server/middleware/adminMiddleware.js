const adminOnly = async (req, res, next) => {
    try{
        if (!req.user) {
            return res.status(401).json({ success: false, error: "Not authenticated" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, error: "Admins only" });
        }

        next();
    } catch (error){
        res.json({success: false, error: error});
    }

};

export default adminOnly