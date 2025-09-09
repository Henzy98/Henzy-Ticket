# 🎫 HENZY Ticket Bot

Profesyonel Discord ticket sistemi - Güvenli, hızlı ve kullanıcı dostu.

## ⚡ Özellikler

### 🎯 Ticket Sistemi
- Modal form ile detaylı ticket oluşturma
- 3 farklı ticket türü (Genel, Teknik, Şikayet)
- Otomatik kategori organizasyonu
- Akıllı ticket yönetimi

### 🔒 Güvenlik
- HENZY Core güvenlik sistemi
- Lisans doğrulama koruması
- Hash tabanlı dosya bütünlüğü kontrolü
- Yetkisiz değişiklik tespiti

### 🎨 Kullanıcı Deneyimi
- Tek tıkla ticket oluşturma
- Interaktif form sistemi
- Otomatik kategori taşıma
- Temiz ve modern arayüz

## 🚀 Kurulum

### Gereksinimler
- Node.js 16.0+
- Discord Bot Token
- Geçerli lisans anahtarı

### Adımlar
```bash
# Bağımlılıkları yükle
npm install

# Botu başlat
node index.js
```

## ⚙️ Konfigürasyon

`config.json` dosyasını düzenleyin:

```json
{
    "DISCORD_TOKEN": "bot_tokeniniz",
    "LICENSE_KEY": "lisans_anahtariniz",
    "GUILD_ID": "sunucu_id",
    "SUPPORT_ROLE_ID": "destek_rol_id",
    "OPEN_TICKETS_CATEGORY": "🎫 AÇIK TICKETLER",
    "CLOSED_TICKETS_CATEGORY": "🔒 KAPALI TICKETLER"
}
```

## 🎮 Kullanım

### Komutlar
- `/ticket-setup` - Ticket panelini oluşturur
- `/close` - Aktif ticketı kapatır

### Ticket Türleri
1. **🔧 Genel Destek** - Genel sorular ve yardım
2. **💻 Teknik Destek** - Teknik problemler
3. **📢 Şikayet** - Şikayet ve geri bildirim

## 🔧 Teknik Detaylar

### Dosya Yapısı
```
├── index.js              # Ana dosya
├── core/henzy.js         # Güvenlik çekirdeği
├── utils/license.js      # Lisans yönetimi
├── events/               # Event handler'lar
├── commands/             # Slash komutlar
└── handlers/             # İşlem yöneticileri
```

### Güvenlik Katmanları
- SHA256 hash kontrolü
- Object.freeze() koruması
- Runtime bütünlük doğrulaması
- Lisans sunucu doğrulaması

## 📋 Discord Ayarları

### Bot İzinleri
- Send Messages
- Manage Channels
- Manage Roles
- View Channels
- Use Slash Commands

### Intent'ler
- Guilds
- Guild Messages
- Message Content
- Guild Members

## 🆔 ID Bulma

**Geliştirici Modu:** Ayarlar > Gelişmiş > Geliştirici Modu

- **Sunucu ID:** Sunucu adına sağ tık > ID'yi Kopyala
- **Rol ID:** Sunucu Ayarları > Roller > Role sağ tık > ID'yi Kopyala
- **Kanal ID:** Kanala sağ tık > ID'yi Kopyala

## 📞 Destek & Lisans

**Discord:** henzy988  
**Lisans:** Kullanım için gerekli  
**Destek:** 7/24 aktif yardım

---

*HENZY Guard System tarafından geliştirilmiştir.*
