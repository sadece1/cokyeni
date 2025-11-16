# Coolify - Hostinger VPS Setup

## VPS Bilgileriniz

```
IP Address: 31.97.216.176
Hostname: srv1074962.hstgr.cloud
Status: Çalışıyor
OS: Ubuntu 24.04 with Coolify
```

## Coolify Form Doldurma

### Server Configuration Formu:

**Server Name:**
```
hostinger-vps
```
veya mevcut otomatik oluşturulan ismi bırakabilirsiniz.

**IP Address/Hostname:**
```
31.97.216.176
```
veya
```
srv1074962.hstgr.cloud
```
(IP adresi daha güvenilir, onu kullanın)

**Description (Opsiyonel):**
```
Hostinger VPS - WeCamp Production Server
```

**Advanced Connection Settings:**

**SSH Port:** `22` (varsayılan)

**SSH User:** `root` (Hostinger VPS'te genellikle root)

**Authentication:**
- SSH Key (önerilen) veya
- Password

## Önemli Not: Coolify Zaten Kurulu!

VPS'inizde "Ubuntu 24.04 with Coolify" yazıyor. Bu demek oluyor ki:
- ✅ Coolify zaten kurulu olabilir
- ✅ Bu durumda "This Machine" seçeneğini de kullanabilirsiniz

### İki Seçenek:

#### Seçenek 1: Remote Server (Önerilen)
- IP: `31.97.216.176`
- SSH ile bağlanır
- Production için uygun

#### Seçenek 2: This Machine
- Eğer Coolify zaten VPS'te kuruluysa
- Localhost olarak bağlanır
- Daha basit ama production için önerilmez

## SSH Bilgilerini Bulma

Hostinger hPanel'den SSH bilgilerinizi alın:

1. **hPanel** → **VPS** → VPS'inizi seçin
2. **SSH Access** bölümüne gidin
3. Şunları not edin:
   - SSH Username: Genellikle `root`
   - SSH Password: VPS kurulum e-postasında veya hPanel'de
   - SSH Key: Eğer key kullanıyorsanız

## Form Doldurma Adımları

1. **Server Name**: `hostinger-vps` (veya mevcut isim)
2. **IP Address/Hostname**: `31.97.216.176`
3. **Description**: `Hostinger VPS - WeCamp Production`
4. **SSH Port**: `22`
5. **SSH User**: `root`
6. **Authentication**: Password veya SSH Key
7. **"Validate Connection"** butonuna tıklayın

## Validate Connection Sonrası

✅ **Başarılı olursa:**
- Coolify agent kurulumuna başlar
- 5-10 dakika sürebilir
- İlerlemeyi takip edin

❌ **Başarısız olursa:**
- SSH bilgilerini kontrol edin
- VPS'in çalıştığını kontrol edin
- Firewall ayarlarını kontrol edin

## Sonraki Adımlar

1. ✅ Server bağlantısı tamamlandı
2. ✅ MySQL service oluştur
3. ✅ Application oluştur (unified veya ayrı)
4. ✅ Environment variables ayarla
5. ✅ Domain ekle
6. ✅ Deploy et

## Troubleshooting

### SSH Bağlantı Sorunu

Eğer "Validate Connection" başarısız olursa:

1. **SSH Test (Manuel):**
   ```bash
   ssh root@31.97.216.176
   ```
   Eğer bu çalışıyorsa, Coolify'da da çalışmalı.

2. **Hostinger Firewall:**
   - hPanel → VPS → Firewall
   - Port 22'nin açık olduğundan emin olun

3. **SSH Bilgileri:**
   - hPanel → VPS → SSH Access
   - Password veya key'i kontrol edin

### Coolify Zaten Kurulu Sorunu

Eğer VPS'te Coolify zaten kuruluysa:
- Remote server olarak bağlanabilirsiniz
- Veya mevcut Coolify instance'ını kullanabilirsiniz
- İki instance çakışmaması için dikkatli olun

## Hızlı Başlangıç Checklist

- [ ] IP adresi: `31.97.216.176` ✅
- [ ] SSH bilgileri hazır
- [ ] Form dolduruldu
- [ ] "Validate Connection" başarılı
- [ ] Agent kurulumu tamamlandı
- [ ] İlk application oluşturuldu

