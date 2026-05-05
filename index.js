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

    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=Xh9eTOG4SCfFcqR30EWZUYQpuIygwa6ozxs75rtjDmdilb8PAvWbhlmfj5kdOH9esCXqN7V2EMDFr1aQ&variables_values=${otp}&route=otp&numbers=${phone}`;

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
