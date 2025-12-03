import { ethers } from 'ethers';

export default async function handler(req, res) {
    // 1. Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // 2. Handle Browser Visits (GET) safely
    if (req.method === 'GET') {
        return res.status(200).json({ 
            status: 'alive', 
            message: 'Signer is running! Send a POST request to sign data.' 
        });
    }

    // 3. Handle Pre-flight checks
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // 4. Safely parse the body
        let body = req.body;
        if (!body) throw new Error("No data received (Body is empty)");
        if (typeof body === 'string') body = JSON.parse(body); // Handle stringified JSON

        const { studentName, courseName, date } = body;

        // --- TEST WALLET (Random) ---
        const wallet = ethers.Wallet.createRandom(); 
        
        const message = `Certificate: ${studentName} completed ${courseName} on ${date}`;
        const signature = await wallet.signMessage(message);

        return res.status(200).json({
            status: 'success',
            signature: signature,
            signerAddress: wallet.address
        });
    } catch (error) {
        return res.status(500).json({ error: 'Signing failed', details: error.message });
    }
}
