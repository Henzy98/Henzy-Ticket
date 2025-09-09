const axios = require('axios');
const { henzyCore } = require('../core/henzy');

let licenseValid = false;
let licenseCheckInterval;

async function verifyLicense(licenseKey, serverUrl) {
    try {
        const expectedUrl = henzyCore.getLicenseUrl();
        if (serverUrl !== expectedUrl) {
            console.error('❌ HENZY CORE: Lisans sunucu URL\'si değiştirilmiş!');
            console.error('❌ Bot güvenlik nedeniyle kapatılıyor...');
            process.exit(1);
        }
        
        const response = await axios.post(`${serverUrl}/verify`, {
            license_key: licenseKey
        }, {
            headers: henzyCore.getLicenseHeaders()
        });
        
        if (response.data.valid) {
            console.log('✅ HENZY: Lisans doğrulandı!');
            licenseValid = true;
            return true;
        } else {
            console.log('❌ HENZY: Lisans geçersiz:', response.data.error);
            licenseValid = false;
            return false;
        }
    } catch (error) {
        console.error('❌ HENZY: Lisans doğrulama hatası:', error.message);
        licenseValid = false;
        return false;
    }
}

async function checkLicensePeriodically(client, licenseKey, serverUrl) {
    const isValid = await verifyLicense(licenseKey, serverUrl);
    if (!isValid) {
        console.log('⚠️ HENZY: Lisans geçersiz veya süresi dolmuş. Bot kapatılıyor...');
        clearInterval(licenseCheckInterval);
        await client.destroy();
        process.exit(0);
    }
}

function startLicenseCheck(client, licenseKey, serverUrl) {
    licenseCheckInterval = setInterval(() => {
        checkLicensePeriodically(client, licenseKey, serverUrl);
    }, 60000);
}

function isLicenseValid() {
    return licenseValid;
}

module.exports = {
    verifyLicense,
    checkLicensePeriodically,
    startLicenseCheck,
    isLicenseValid
};
