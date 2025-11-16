# Coolify Deployment Rehberi

## Genel Bakış

Coolify'da backend ve frontend'i **ayrı ayrı** deploy edeceğiz. Bu yaklaşım daha esnek, ölçeklenebilir ve yönetilebilir bir yapı sağlar.

## Deployment Yapısı

```
┌─────────────────┐
│   Frontend      │  → wecamp.com.tr
│   (React/Vite)  │
└─────────────────┘
        │
        │ API Calls
        ▼
┌─────────────────┐
│   Backend       │  → api.wecamp.com.tr
│   (Node.js)     │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   MySQL         │  → Internal Service
│   (Database)    │
└─────────────────┘
```

## Ön Hazırlık

### 1. Coolify Kurulumu
- Coolify'ı sunucunuza kurun (Docker tabanlı)
- Coolify web arayüzüne erişin
- Git provider'ınızı bağlayın (GitHub, GitLab, vb.)

### 2. Domain Ayarları
DNS kayıtlarınızı hazırlayın:
```
A Record: wecamp.com.tr → [Sunucu IP]
A Record: www.wecamp.com.tr → [Sunucu IP]
A Record: api.wecamp.com.tr → [Sunucu IP]
```

## Backend Deployment

### 1. Coolify'da Yeni Application Oluşturma

1. Coolify dashboard'da **"Applications"** → **"New Application"**
2. **Application Name**: `wecamp-backend`
3. **Source**: Git repository seçin veya manuel upload
4. **Build Pack**: `Docker` seçin

### 2. Dockerfile Konfigürasyonu

Backend için `server/Dockerfile` zaten hazır. Coolify otomatik olarak bulacaktır.

**Build Context**: `server/` dizini olmalı

Coolify'da ayarlar:
- **Dockerfile Path**: `server/Dockerfile`
- **Build Context**: `server/`
- **Docker Compose**: Kullanmıyoruz (tek container)

### 3. Environment Variables

Coolify'da **"Environment Variables"** bölümüne ekleyin:

#### Required Secrets (Sensitive - Secret olarak işaretle)
```
DB_HOST=wecamp-mysql (veya internal service name)
DB_USER=wecamp_user
DB_PASSWORD=******** (secret)
DB_NAME=wecamp_marketplace
DB_PORT=3306
JWT_SECRET=******** (min 64 karakter, secret)
JWT_REFRESH_SECRET=******** (min 64 karakter, secret)
FRONTEND_URL=https://wecamp.com.tr
ALLOWED_ORIGINS=https://wecamp.com.tr,https://www.wecamp.com.tr
```

#### General Environment Variables
```
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
UPLOAD_DIR=/app/uploads
MAX_USER_UPLOAD_QUOTA=1073741824
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_UPLOADS_PER_HOUR=50
ENABLE_CSRF=false
ENABLE_VIRUS_SCAN=false
REQUIRE_VIRUS_SCAN=false
HTTPS_ENFORCE=true
MAX_JSON_SIZE=1mb
MAX_URLENCODED_SIZE=1mb
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### 4. Persistent Volumes

Coolify'da **"Volumes"** bölümüne ekleyin:

```
/app/uploads → wecamp-backend-uploads
/app/logs → wecamp-backend-logs
```

### 5. MySQL Service (Database)

Coolify'da **"Services"** → **"MySQL"** oluşturun:

- **Service Name**: `wecamp-mysql`
- **Version**: `8.0`
- **Database Name**: `wecamp_marketplace`
- **Root Password**: (güçlü bir şifre)
- **Volume**: `wecamp-mysql-data` (persistent storage)

**Önemli**: MySQL service'in internal network name'ini backend environment variable'ında kullanın:
- `DB_HOST=wecamp-mysql` (Coolify otomatik DNS çözümlemesi yapar)

### 6. Domain ve SSL

1. **"Domains"** bölümüne gidin
2. Domain ekleyin: `api.wecamp.com.tr`
3. SSL: **Let's Encrypt** (otomatik)
4. **Force HTTPS**: Aktif

### 7. Port Mapping

- **Container Port**: `80` (NGINX)
- **Public Port**: Coolify otomatik yönetir (reverse proxy)

### 8. Health Check

Coolify'da health check ayarları:
- **Path**: `/health`
- **Interval**: `30s`
- **Timeout**: `3s`
- **Retries**: `3`

### 9. Resource Limits

```
CPU Limit: 1000m
Memory Limit: 512Mi
CPU Request: 500m
Memory Request: 256Mi
```

### 10. Deploy

1. Tüm ayarları kontrol edin
2. **"Deploy"** butonuna tıklayın
3. Build loglarını takip edin
4. Deployment tamamlandığında test edin: `https://api.wecamp.com.tr/health`

## Frontend Deployment

### 1. Coolify'da Yeni Application Oluşturma

1. Coolify dashboard'da **"Applications"** → **"New Application"**
2. **Application Name**: `wecamp-frontend`
3. **Source**: Git repository seçin (aynı repo, farklı build context)
4. **Build Pack**: `Docker` seçin

### 2. Dockerfile Konfigürasyonu

Frontend için root dizindeki `Dockerfile` kullanılacak.

Coolify'da ayarlar:
- **Dockerfile Path**: `Dockerfile` (root dizinde)
- **Build Context**: `.` (root dizin)
- **Docker Compose**: Kullanmıyoruz

### 3. Build Arguments

Coolify'da **"Build Arguments"** bölümüne ekleyin:

```
VITE_API_BASE_URL=https://api.wecamp.com.tr/api
```

**Not**: Vite build-time environment variables için build args kullanılır.

### 4. Environment Variables

Frontend için environment variables (build-time):

```
NODE_ENV=production
VITE_API_BASE_URL=https://api.wecamp.com.tr/api
VITE_APP_NAME=WeCamp
VITE_APP_DESCRIPTION=Doğada unutulmaz kamp deneyimleri için kamp alanları ve kiralık kamp malzemeleri
```

**Önemli**: Vite değişkenleri build sırasında kullanılır, runtime'da değil!

### 5. Domain ve SSL

1. **"Domains"** bölümüne gidin
2. Domain ekleyin: `wecamp.com.tr` ve `www.wecamp.com.tr`
3. SSL: **Let's Encrypt** (otomatik)
4. **Force HTTPS**: Aktif
5. **Redirect www to non-www** (veya tersi, tercihinize göre)

### 6. Port Mapping

- **Container Port**: `80` (NGINX)
- **Public Port**: Coolify otomatik yönetir

### 7. Health Check

- **Path**: `/` (veya `/health` eğer nginx.conf'da varsa)
- **Interval**: `30s`
- **Timeout**: `3s`
- **Retries**: `3`

### 8. Resource Limits

```
CPU Limit: 500m
Memory Limit: 256Mi
CPU Request: 100m
Memory Request: 128Mi
```

### 9. Deploy

1. Tüm ayarları kontrol edin
2. **"Deploy"** butonuna tıklayın
3. Build loglarını takip edin
4. Deployment tamamlandığında test edin: `https://wecamp.com.tr`

## Deployment Sırası

### Önerilen Sıra:

1. **MySQL Service** → Önce database'i deploy edin
2. **Backend** → Database hazır olduktan sonra backend'i deploy edin
3. **Frontend** → Backend çalıştıktan sonra frontend'i deploy edin

### Neden Bu Sıra?

- Frontend backend'e bağımlı (API calls)
- Backend database'e bağımlı
- Database bağımsız

## Deployment Sonrası Kontroller

### 1. Backend Kontrolleri

```bash
# Health check
curl https://api.wecamp.com.tr/health

# API endpoint test
curl https://api.wecamp.com.tr/api/health
```

### 2. Frontend Kontrolleri

```bash
# Frontend erişimi
curl https://wecamp.com.tr

# Browser'da açın ve console'u kontrol edin
```

### 3. API Bağlantısı

1. Frontend'i browser'da açın
2. Developer Console → Network tab
3. API isteklerinin `https://api.wecamp.com.tr/api` adresine gittiğini kontrol edin
4. CORS hataları olmamalı

### 4. Database Bağlantısı

1. Backend logs'ları kontrol edin
2. Database connection başarılı olmalı
3. Migration'lar çalıştırıldı mı kontrol edin

## Coolify Özellikleri

### 1. Auto-Deploy

Git push ile otomatik deploy:
- **Branch**: `main` veya `master`
- **Webhook**: Coolify otomatik oluşturur
- Her push'ta otomatik rebuild ve redeploy

### 2. Environment Management

- **Production**: Ana deployment
- **Staging**: Test için ayrı environment (opsiyonel)
- Environment variables ayrı yönetilir

### 3. Monitoring

- **Logs**: Real-time log görüntüleme
- **Metrics**: CPU, Memory kullanımı
- **Health Checks**: Otomatik health monitoring

### 4. Rollback

- Her deployment bir version oluşturur
- Önceki version'a geri dönebilirsiniz
- **"Rollback"** butonu ile kolay geri alma

### 5. Scaling

- **Horizontal Scaling**: Replica sayısını artırın
- **Vertical Scaling**: Resource limits'i artırın
- Auto-scaling (opsiyonel)

## Troubleshooting

### Backend Sorunları

#### Database Connection Error
```
Error: connect ECONNREFUSED
```

**Çözüm**:
1. MySQL service'in çalıştığını kontrol edin
2. `DB_HOST` environment variable'ının doğru olduğunu kontrol edin
3. Internal network'te service name kullanın: `wecamp-mysql`
4. MySQL port'unun açık olduğunu kontrol edin

#### CORS Errors
```
Access-Control-Allow-Origin
```

**Çözüm**:
1. `ALLOWED_ORIGINS` environment variable'ını kontrol edin
2. Frontend domain'ini ekleyin: `https://wecamp.com.tr`
3. Backend'i restart edin

### Frontend Sorunları

#### Blank Page / White Screen
**Çözüm**:
1. Browser console'da JavaScript hatalarını kontrol edin
2. Network tab'de failed requests kontrol edin
3. Build'in başarılı olduğunu kontrol edin
4. `VITE_API_BASE_URL` build arg'ının doğru olduğunu kontrol edin

#### API Connection Errors
**Çözüm**:
1. Backend'in çalıştığını kontrol edin: `https://api.wecamp.com.tr/health`
2. CORS ayarlarını kontrol edin
3. `VITE_API_BASE_URL` build arg'ının doğru olduğunu kontrol edin
4. Browser console'da network errors'ı kontrol edin

#### 404 on Page Refresh
**Çözüm**:
1. NGINX konfigürasyonunun SPA fallback içerdiğini kontrol edin
2. `nginx.conf` dosyasında `try_files $uri $uri/ /index.html;` olmalı
3. Frontend'i rebuild edin

### Build Sorunları

#### Build Fails
**Çözüm**:
1. Build logs'ları kontrol edin
2. Dependencies eksik mi kontrol edin
3. Node version uyumlu mu kontrol edin
4. Build context doğru mu kontrol edin

#### Out of Memory
**Çözüm**:
1. Resource limits'i artırın
2. Build sırasında memory kullanımını optimize edin
3. Multi-stage build kullanın (zaten kullanılıyor)

## Production Checklist

### Backend
- [ ] MySQL service deploy edildi ve çalışıyor
- [ ] Backend environment variables ayarlandı
- [ ] Database migrations çalıştırıldı
- [ ] Backend health check başarılı: `https://api.wecamp.com.tr/health`
- [ ] SSL sertifikası aktif
- [ ] CORS ayarları doğru
- [ ] Persistent volumes mount edildi
- [ ] Logs görüntülenebiliyor

### Frontend
- [ ] Frontend build başarılı
- [ ] Build args doğru ayarlandı (`VITE_API_BASE_URL`)
- [ ] Domain ve SSL ayarlandı
- [ ] Frontend erişilebilir: `https://wecamp.com.tr`
- [ ] API bağlantısı çalışıyor (browser console kontrol)
- [ ] SPA routing çalışıyor (sayfa refresh test)
- [ ] Responsive design test edildi

### Genel
- [ ] DNS kayıtları doğru
- [ ] SSL sertifikaları aktif (Let's Encrypt)
- [ ] Auto-deploy ayarlandı (git webhook)
- [ ] Monitoring aktif
- [ ] Backup stratejisi hazır (MySQL)
- [ ] Admin credentials değiştirildi
- [ ] Test login başarılı

## Coolify vs Dokploy Karşılaştırması

| Özellik | Coolify | Dokploy |
|---------|---------|---------|
| Deployment | Ayrı applications | Ayrı applications |
| Docker Support | ✅ | ✅ |
| Auto-Deploy | ✅ (Git webhook) | ✅ (Git webhook) |
| SSL | ✅ (Let's Encrypt) | ✅ (Let's Encrypt) |
| Monitoring | ✅ | ✅ |
| Rollback | ✅ | ✅ |
| Scaling | ✅ | ✅ |
| Database Services | ✅ | ✅ |
| Volumes | ✅ | ✅ |

## Migration from Dokploy to Coolify

### Adımlar:

1. **Coolify Kurulumu**
   - Coolify'ı sunucuya kurun
   - Web arayüzüne erişin

2. **Applications Oluşturma**
   - Backend application oluşturun
   - Frontend application oluşturun
   - MySQL service oluşturun

3. **Environment Variables Migration**
   - Dokploy'daki env vars'ları Coolify'a kopyalayın
   - Secret olarak işaretlenmesi gerekenleri işaretleyin

4. **Domain Migration**
   - Domain'leri Coolify'a ekleyin
   - SSL sertifikalarını yeniden oluşturun

5. **Deploy**
   - Önce MySQL
   - Sonra Backend
   - Son olarak Frontend

6. **Test**
   - Tüm endpoint'leri test edin
   - Frontend-backend bağlantısını test edin

7. **DNS Update** (Gerekirse)
   - Eğer sunucu IP değiştiyse DNS'i güncelleyin

## Best Practices

### 1. Separate Deployments
✅ **DO**: Backend ve frontend'i ayrı deploy edin
❌ **DON'T**: Tek bir container'da ikisini birlikte çalıştırmayın

### 2. Environment Variables
✅ **DO**: Sensitive data'yı secret olarak işaretleyin
❌ **DON'T**: Secret'ları plain text olarak saklamayın

### 3. Resource Management
✅ **DO**: Resource limits belirleyin
❌ **DON'T**: Unlimited resources kullanmayın

### 4. Health Checks
✅ **DO**: Health check endpoint'leri kullanın
❌ **DON'T**: Health check olmadan deploy etmeyin

### 5. Monitoring
✅ **DO**: Logs ve metrics'i düzenli kontrol edin
❌ **DON'T**: Monitoring'i görmezden gelmeyin

### 6. Backups
✅ **DO**: Database backup stratejisi oluşturun
❌ **DON'T**: Backup olmadan production'a geçmeyin

## Sonuç

Coolify'da backend ve frontend'i **ayrı ayrı** deploy etmek en iyi pratik. Bu yaklaşım:
- ✅ Daha esnek yapı
- ✅ Bağımsız scaling
- ✅ Kolay maintenance
- ✅ Daha iyi resource management
- ✅ Production-ready architecture

Her iki servis de kendi domain'i, SSL'i, environment variables'ı ve resource limits'i ile bağımsız çalışır.

