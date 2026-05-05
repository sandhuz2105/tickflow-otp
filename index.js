const express = require('express');
const https = require('https');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.post('/send-otp', (req, res) => {
    const { phone, otp } = req.body;
    console.log(`Sending OTP ${otp} to ${phone}`);

    const url = `https://2factor.in/API/V1/65ab5bc8-488a-11f1-9800-0200cd936042/SMS/${phone}/${otp}/OTP1`;
    https.get(url, { headers: { 'cache-control': 'no-cache' } }, (apiRes) => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
            console.log('Fast2SMS response:', data);
            try { res.json(JSON.parse(data)); }
            catch { res.json({ message: 'OTP sent' }); }
        });
    }).on('error', (err) => {
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Failed to send OTP' });
    });
});

app.get('/', (req, res) => res.send('TickFlow OTP Server Running'));

app.listen(process.env.PORT || 3000, () => console.log('Server running'));
