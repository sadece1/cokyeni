# Coolify Kurulum ve Setup Rehberi

## 1. Server Seçimi

### Hostinger VPS için: **"Remote Server"** Seçin

**Neden?**
- ✅ Production için uygun
- ✅ VPS'inizde Coolify çalışır
- ✅ Uygulamalarınız aynı sunucuda deploy edilir
- ✅ Daha iyi performans

**"This Machine" seçmeyin çünkü:**
- ❌ Sadece test için
- ❌ Production için önerilmez
- ❌ Resource contention sorunları

## 2. Remote Server Bağlantısı

### Adım 1: SSH Bilgilerini Hazırlayın

Hostinger VPS'iniz için gerekli bilgiler:
- **Server IP**: VPS IP adresiniz
- **SSH Port**: Genellikle `22`
- **Username**: `root` veya başka bir kullanıcı
- **SSH Key veya Password**: SSH key veya şifre

### Adım 2: Coolify'da Server Ekleme

1. **"Remote Server"** seçeneğine tıklayın
2. **Server Name**: `hostinger-vps` (veya istediğiniz isim)
3. **IP Address**: VPS IP adresiniz
4. **SSH Port**: `22` (genellikle)
5. **SSH User**: `root` (veya başka kullanıcı)

### Adım 3: SSH Authentication

**Seçenek 1: SSH Key (Önerilen)**
- SSH private key'inizi yükleyin
- Daha güvenli
- Password gerektirmez

**Seçenek 2: Password**
- SSH password'unuzu girin
- Daha kolay ama daha az güvenli

### Adım 4: Server Bağlantısını Test Edin

Coolify otomatik olarak bağlantıyı test eder:
- ✅ Bağlantı başarılı → Devam edin
- ❌ Bağlantı başarısız → SSH bilgilerini kontrol edin

## 3. Coolify Agent Kurulumu

Coolify, seçtiğiniz sunucuya otomatik olarak **agent** kurar:
- Docker kurulumu
- Gerekli servisler
- Network yapılandırması

**Not**: Bu işlem birkaç dakika sürebilir.

## 4. İlk Application Oluşturma

Server bağlantısı tamamlandıktan sonra:

### Option A: Unified Deployment (Tek Container)

1. **"Applications"** → **"New Application"**
2. **Application Name**: `wecamp-unified`
3. **Server**: `hostinger-vps` (az önce eklediğiniz)
4. **Source**: Git repository seçin
5. **Build Pack**: `Docker`
6. **Dockerfile**: `Dockerfile.unified`
7. **Build Context**: `.`

### Option B: Ayrı Deployment (İki Container)

**Backend:**
1. **"Applications"** → **"New Application"**
2. **Application Name**: `wecamp-backend`
3. **Server**: `hostinger-vps`
4. **Source**: Git repository
5. **Build Pack**: `Docker`
6. **Dockerfile**: `server/Dockerfile`
7. **Build Context**: `server/`

**Frontend:**
1. **"Applications"** → **"New Application"**
2. **Application Name**: `wecamp-frontend`
3. **Server**: `hostinger-vps`
4. **Source**: Git repository (aynı repo)
5. **Build Pack**: `Docker`
6. **Dockerfile**: `Dockerfile` (root'ta)
7. **Build Context**: `.`

## 5. Environment Variables

### Unified Deployment için:

**Build Arguments:**
```
VITE_API_BASE_URL=/api
```

**Environment Variables:**
```
NODE_ENV=production
PORT=3000
DB_HOST=wecamp-mysql
DB_USER=wecamp_user
DB_PASSWORD=********
DB_NAME=wecamp_marketplace
DB_PORT=3306
JWT_SECRET=********
JWT_REFRESH_SECRET=********
FRONTEND_URL=https://wecamp.com.tr
ALLOWED_ORIGINS=https://wecamp.com.tr,https://www.wecamp.com.tr
# ... diğer backend env vars
```

### Ayrı Deployment için:

**Backend Environment Variables:**
```
NODE_ENV=production
PORT=3000
DB_HOST=wecamp-mysql
# ... tüm backend env vars
```

**Frontend Build Arguments:**
```
VITE_API_BASE_URL=https://api.wecamp.com.tr/api
```

## 6. MySQL Service Oluşturma

1. **"Services"** → **"MySQL"**
2. **Service Name**: `wecamp-mysql`
3. **Server**: `hostinger-vps`
4. **Version**: `8.0`
5. **Database Name**: `wecamp_marketplace`
6. **Root Password**: Güçlü bir şifre
7. **Volume**: `wecamp-mysql-data` (persistent storage)

**Önemli**: MySQL service'in internal name'ini backend env var'da kullanın:
- `DB_HOST=wecamp-mysql`

## 7. Domain ve SSL

1. **"Domains"** bölümüne gidin
2. Domain ekleyin:
   - Unified: `wecamp.com.tr` ve `www.wecamp.com.tr`
   - Ayrı: `wecamp.com.tr` (frontend), `api.wecamp.com.tr` (backend)
3. **SSL**: Let's Encrypt (otomatik)
4. **Force HTTPS**: Aktif

## 8. DNS Ayarları

Hostinger Domain Panel'de DNS kayıtları:

**Unified Deployment:**
```
A Record: wecamp.com.tr → [VPS IP]
A Record: www.wecamp.com.tr → [VPS IP]
```

**Ayrı Deployment:**
```
A Record: wecamp.com.tr → [VPS IP]
A Record: www.wecamp.com.tr → [VPS IP]
A Record: api.wecamp.com.tr → [VPS IP]
```

## 9. Deploy

1. Tüm ayarları kontrol edin
2. **"Deploy"** butonuna tıklayın
3. Build loglarını takip edin
4. Deployment tamamlandığında test edin

## Troubleshooting

### SSH Bağlantı Hatası

**Hata**: "Connection failed" veya "SSH timeout"

**Çözüm**:
1. VPS IP adresinin doğru olduğunu kontrol edin
2. SSH port'unun açık olduğunu kontrol edin (genellikle 22)
3. Firewall'da SSH port'unun açık olduğunu kontrol edin
4. SSH key veya password'un doğru olduğunu kontrol edin
5. VPS'in çalıştığını kontrol edin

### Agent Kurulum Hatası

**Hata**: "Agent installation failed"

**Çözüm**:
1. VPS'te yeterli disk alanı olduğunu kontrol edin
2. VPS'te Docker kurulu mu kontrol edin
3. Coolify loglarını kontrol edin
4. VPS'e manuel SSH ile bağlanıp kontrol edin

### Build Hatası

**Hata**: "Build failed"

**Çözüm**:
1. Build logs'ları kontrol edin
2. Dockerfile path'inin doğru olduğunu kontrol edin
3. Build context'in doğru olduğunu kontrol edin
4. Environment variables'ların doğru olduğunu kontrol edin

## Hostinger VPS Özel Notlar

### 1. Firewall Ayarları

Hostinger VPS'te firewall ayarlarını kontrol edin:
- Port 22 (SSH) - Açık olmalı
- Port 80 (HTTP) - Coolify otomatik yönetir
- Port 443 (HTTPS) - Coolify otomatik yönetir

### 2. Resource Limits

Hostinger VPS'inizin kaynaklarını kontrol edin:
- CPU: Yeterli mi?
- RAM: Yeterli mi? (en az 2GB önerilir)
- Disk: Yeterli mi? (en az 20GB önerilir)

### 3. Docker Kurulumu

Coolify agent otomatik olarak Docker kurar, ama manuel kontrol için:
```bash
ssh root@your-vps-ip
docker --version
docker-compose --version
```

## Sonraki Adımlar

1. ✅ Server bağlantısı tamamlandı
2. ✅ MySQL service oluşturuldu
3. ✅ Application oluşturuldu
4. ✅ Environment variables ayarlandı
5. ✅ Domain eklendi
6. ✅ Deploy edildi
7. ✅ Test edildi

## Yardımcı Dokümanlar

- **Unified Deployment**: `COOLIFY_UNIFIED_DEPLOYMENT.md`
- **Ayrı Deployment**: `COOLIFY_DEPLOYMENT.md`
- **Hızlı Başlangıç**: `COOLIFY_DEPLOYMENT_SUMMARY.md`

## Önemli Notlar

1. **İlk kurulum**: Coolify agent kurulumu 5-10 dakika sürebilir
2. **Build süresi**: İlk build 10-15 dakika sürebilir (dependencies indirme)
3. **SSL sertifikası**: Let's Encrypt sertifikası 1-2 dakika içinde aktif olur
4. **DNS propagation**: DNS değişiklikleri 24 saat içinde yayılır (genellikle daha hızlı)

## Destek

Sorun yaşarsanız:
1. Coolify logs'larını kontrol edin
2. Application logs'larını kontrol edin
3. VPS'e SSH ile bağlanıp Docker containers'ları kontrol edin: `docker ps`
4. Coolify community forum'una bakın

