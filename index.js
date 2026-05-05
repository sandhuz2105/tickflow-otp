const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.post('/send-otp', async (req, res) => {
    const { phone, otp } = req.body;
    try {
        const response = await fetch(
            ``https://www.fast2sms.com/dev/bulkV2?authorization=Xh9eTOG4SCfFcqR30EWZUYQpuIygwa6ozxs75rtjDmdilb8PAvWbhlmfj5kdOH9esCXqN7V2EMDFr1aQ&route=q&message=Your TickFlow OTP is ${otp}. Valid for 5 minutes.&numbers=${phone}`,
            { method: 'GET', headers: { 'cache-control': 'no-cache' } }
        );
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

app.get('/', (req, res) => res.send('TickFlow OTP Server Running'));

app.listen(process.env.PORT || 3000, () => console.log('Server running'));
