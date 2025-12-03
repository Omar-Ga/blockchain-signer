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

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { studentName, courseName, date } = req.body;
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

