import jwt from "jsonwebtoken";

export const verifyPlayerToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: "Access token required. Please login as a player." 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if this is a player token (not admin)
    if (decoded.type !== 'player') {
      return res.status(403).json({ 
        error: "Player access required" 
      });
    }

    req.player = {
      id: decoded.id,
      name: decoded.name,
      type: decoded.type
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: "Token expired. Please login again." 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: "Invalid token. Please login again." 
      });
    }
    
    return res.status(500).json({ 
      error: "Token verification failed" 
    });
  }
};

// Optional: Middleware that allows both admin and player access
export const verifyAnyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: "Access token required" 
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type === 'admin') {
      req.admin = decoded;
    } else if (decoded.type === 'player') {
      req.player = decoded;
    } else {
      return res.status(403).json({ error: "Invalid token type" });
    }
    
    req.userType = decoded.type;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
