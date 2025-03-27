import jwt from "jsonwebtoken";

const isAuthenticated = (req,res,next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({success: false, message: 'Unauthorized'});
        };

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) {
            
            return res.status(401).json({success: false, message: 'Unauthorized'});
        };
        
        req.user = verified.UserId;
        next();  

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export default isAuthenticated;