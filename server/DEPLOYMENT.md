# WeCamp Backend Deployment Guide

## Hostinger VPS + Dokploy Deployment

Bu rehber, WeCamp backend'ini Hostinger VPS üzerinde Dokploy kullanarak nasıl deploy edeceğinizi anlatır.

## Ön Hazırlık

### 1. Hostinger VPS'e Dokploy Kurulumu

Dokploy'u VPS'inize kurmak için:

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

### 2. Gerekli Bilgiler

- **Domain**: api.wecamp.com.tr (veya kullanacağınız domain)
- **Frontend URL**: https://wecamp.com.tr
- **MySQL Database**: Dokploy içinde oluşturulacak

## Deployment Adımları

### 1. Dokploy Paneline Giriş

- VPS IP adresiniz üzerinden Dokploy'a erişin: `http://YOUR_VPS_IP:3000`
- Admin hesabınızla giriş yapın

### 2. MySQL Database Oluşturma

1. Dokploy panelinde "Services" bölümüne gidin
2. "MySQL" seçin
3. Aşağıdaki bilgileri girin:
   - **Service Name**: wecamp-mysql
   - **MySQL Version**: 8.0
   - **Database Name**: wecamp_marketplace
   - **Root Password**: Güçlü bir şifre oluşturun (en az 16 karakter)

### 3. Backend Uygulaması Oluşturma

1. "Applications" bölümüne gidin
2. "Create Application" tıklayın
3. "Docker" seçin
4. Repository URL'yi girin veya dosyaları upload edin

### 4. Environment Variables (Çevre Değişkenleri)

Dokploy panelinde aşağıdaki environment variables'ları ekleyin:

#### Temel Ayarlar
```
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

#### Database Ayarları
```
DB_HOST=wecamp-mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=[MySQL oluştururken belirlediğiniz şifre]
DB_NAME=wecamp_marketplace
```

#### JWT Secrets (ÖNEMLİ!)

Güçlü rastgele secretlar oluşturun. Şu komutu terminalde çalıştırabilirsiniz:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

```
JWT_SECRET=[64 karakterlik güçlü secret]
JWT_REFRESH_SECRET=[64 karakterlik başka bir güçlü secret]
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

#### Frontend ve CORS Ayarları
```
FRONTEND_URL=https://wecamp.com.tr
ALLOWED_ORIGINS=https://wecamp.com.tr,https://www.wecamp.com.tr
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
```

#### File Upload Ayarları
```
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
UPLOAD_DIR=/app/uploads
MAX_USER_UPLOAD_QUOTA=1073741824
MAX_UPLOADS_PER_HOUR=50
```

#### Rate Limiting
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Security
```
ENABLE_CSRF=false
ENABLE_VIRUS_SCAN=false
REQUIRE_VIRUS_SCAN=false
HTTPS_ENFORCE=true
MAX_JSON_SIZE=1mb
MAX_URLENCODED_SIZE=1mb
```

### 5. Volume Mounting (Persistent Storage)

Dokploy panelinde aşağıdaki volume'ları ekleyin:

1. **Uploads Volume**
   - **Name**: wecamp-uploads
   - **Mount Path**: /app/uploads
   - **Description**: User uploaded files

2. **Logs Volume**
   - **Name**: wecamp-logs
   - **Mount Path**: /app/logs
   - **Description**: Application logs

### 6. Domain ve SSL Ayarları

1. Dokploy panelinde "Domains" bölümüne gidin
2. Domain ekleyin: `api.wecamp.com.tr`
3. SSL Certificate için "Let's Encrypt" seçin
4. Email adresinizi girin

**DNS Ayarları (Hostinger Domain Panel)**:
```
A Record: api.wecamp.com.tr → [VPS IP Adresi]
```

### 7. Port ve Network Ayarları

- **Container Port**: 80 (NGINX proxy)
- **Public Port**: 80 (HTTP) ve 443 (HTTPS)
- **Protocol**: TCP

### 8. Dockerfile Kullanımı

Backend klasöründe bulunan `Dockerfile` otomatik olarak kullanılacaktır. Bu Dockerfile:
- Multi-stage build ile optimize edilmiş
- NGINX reverse proxy içerir
- Production için hazır
- Health check içerir

### 9. Database Migration ve Seed

İlk deployment'tan sonra, database'i hazırlamak için:

1. Dokploy panelinde container'a terminal bağlantısı açın
2. Aşağıdaki komutları çalıştırın:

```bash
cd /app
npm run db:migrate
npm run db:seed
```

Bu komutlar:
- Database tablolarını oluşturur
- Başlangıç verilerini ekler (admin user, kategoriler, vs.)

**Default Admin Kullanıcısı** (seed data ile oluşturulur):
- **Email**: admin@campscape.com
- **Password**: Admin123!
- **İlk girişten sonra mutlaka şifreyi değiştirin!**

### 10. Deployment'ı Başlatma

1. Tüm ayarları kontrol edin
2. "Deploy" butonuna tıklayın
3. Build loglarını takip edin
4. Deployment tamamlandığında health check'i kontrol edin: `https://api.wecamp.com.tr/health`

## Deployment Sonrası Kontroller

### Health Check
```bash
curl https://api.wecamp.com.tr/health
```

Başarılı yanıt:
```json
{
  "success": true,
  "message": "Server is running",
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

### Database Bağlantısı
Health check başarılıysa database bağlantısı da çalışıyordur.

### API Test
```bash
# Admin login test
curl -X POST https://api.wecamp.com.tr/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@campscape.com","password":"Admin123!"}'
```

### Logs Kontrolü
Dokploy panelinde "Logs" sekmesinden application loglarını takip edebilirsiniz.

## Frontend'i Backend'e Bağlama

Frontend `.env` dosyasını güncelleyin:

```env
VITE_API_BASE_URL=https://api.wecamp.com.tr/api
```

## Güvenlik Önlemleri

### 1. Default Şifreleri Değiştirin
- Admin kullanıcı şifresini değiştirin
- Database root şifresini güçlü yapın

### 2. JWT Secrets
- Rastgele, 64+ karakter uzunluğunda
- Asla public repository'ye push etmeyin
- Her environment için farklı secret kullanın

### 3. CORS Ayarları
- Sadece kendi domain'lerinizi ALLOWED_ORIGINS'e ekleyin
- Wildcard (*) kullanmayın production'da

### 4. Rate Limiting
- API abuse'e karşı rate limit aktif
- Gerekirse değerleri ayarlayın

### 5. File Upload
- Maximum file size limiti
- Allowed file types kontrolü
- Virus scan etkinleştirilebilir (opsiyonel)

### 6. SSL/HTTPS
- Let's Encrypt ile otomatik SSL
- HTTPS enforce aktif
- HTTP trafiği HTTPS'e yönlendirilir

## Bakım ve Güncelleme

### Yeni Version Deploy Etme
1. Kod değişikliklerini repository'ye push edin
2. Dokploy panelinde "Rebuild" tıklayın
3. Yeni build'i deploy edin

### Database Backup
Dokploy panelinde MySQL service'in backup ayarlarını yapılandırın.

### Monitoring
- Dokploy metrics'i takip edin
- Log dosyalarını düzenli kontrol edin
- Disk kullanımını izleyin (uploads ve logs için)

## Sorun Giderme

### Container Başlamıyor
- Logs'u kontrol edin
- Environment variables'ları kontrol edin
- Database bağlantısını test edin

### Database Connection Error
- MySQL service'in çalıştığını kontrol edin
- DB_HOST değerinin doğru olduğunu kontrol edin (wecamp-mysql)
- Database credentials'ları kontrol edin

### 502 Bad Gateway
- Container'ın çalıştığını kontrol edin
- Port mapping'i kontrol edin
- NGINX konfigürasyonunu kontrol edin

### Upload Sorunları
- Volume mount'ların doğru yapıldığını kontrol edin
- /app/uploads klasörünün write permission'ı olduğunu kontrol edin

## Destek

Sorun yaşarsanız:
1. Dokploy loglarını kontrol edin
2. Container'a terminal bağlantısı açıp manuel kontrol yapın
3. Health check endpoint'ini test edin

