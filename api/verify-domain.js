// API route for domain verification
// This can handle various verification methods dynamically

export default async function handler(req, res) {
    const { method, query } = req;
    
    // Handle different verification methods
    if (method === 'GET') {
        // Check if it's a domain verification request
        if (query.verification || query.token) {
            const verificationToken = query.verification || query.token;
            
            // You can store verification tokens in environment variables
            // or return them dynamically based on your needs
            const validTokens = [
                process.env.VERCEL_VERIFICATION_TOKEN,
                process.env.DOMAIN_VERIFICATION_TOKEN,
                // Add more tokens as needed
            ].filter(Boolean);
            
            if (validTokens.includes(verificationToken)) {
                return res.status(200).json({
                    success: true,
                    verified: true,
                    token: verificationToken
                });
            }
            
            // If no valid token, return the verification content anyway
            return res.status(200).text(verificationToken);
        }
        
        // Default response for domain verification
        return res.status(200).json({
            domain: req.headers.host,
            verified: true,
            timestamp: new Date().toISOString()
        });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
