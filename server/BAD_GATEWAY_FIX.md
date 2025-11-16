# Bad Gateway Hatası Çözümü

## Hata
```
Bad Gateway
```

## Neden Oluşur?

NGINX çalışıyor ama **Node.js backend'e bağlanamıyor**:
1. Backend Node.js server başlamamış
2. Backend port 3000'de dinlemiyor
3. Database connection başarısız → Server başlamamış
4. Environment variables eksik/yanlış

## Çözüm: Backend Loglarını Kontrol Edin

### 1. Backend Container Logları
Dokploy → Backend Container → **Logs**

**Aranacaklar:**
- ✅ `✅ Environment variables validated`
- ✅ `✅ Database connection established successfully`
- ✅ `🚀 Server is running on port 3000`
- ❌ `❌ Environment validation failed`
- ❌ `❌ Database connection failed`
- ❌ `ERROR: /app/dist/server.js not found`

### 2. Olası Hatalar ve Çözümleri

#### Hata 1: Environment Variables Eksik
```
❌ Environment validation failed: Missing required environment variables
```

**Çözüm:** Dokploy → Backend Container → Environment → Tüm değişkenleri ekleyin

#### Hata 2: Database Connection Failed
```
❌ Database connection failed
```

**Çözüm:** 
- MySQL container çalışıyor mu?
- `DB_HOST` doğru mu? (`dfgdfg-wecampmysql-c6zsle`)
- Database credentials doğru mu?

#### Hata 3: server.js Not Found
```
ERROR: /app/dist/server.js not found
```

**Çözüm:** Backend container'ı **redeploy** edin

#### Hata 4: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Çözüm:** Backend container'ı **restart** edin

## Hızlı Çözüm

### Adım 1: Backend Loglarını Kontrol
Dokploy → Backend Container → **Logs** → Son 50 satırı kontrol edin

### Adım 2: Backend Container Restart
Dokploy → Backend Container → **Restart**

### Adım 3: Logları Tekrar Kontrol
Restart sonrası logları kontrol edin:
- Server başladı mı?
- Database bağlantısı başarılı mı?

## Beklenen Backend Logları

```
=== CONTAINER STARTING ===
Starting NGINX...
NGINX started successfully (PID: X)
Starting Node.js server...
✅ Environment variables validated
📊 Database Configuration:
  Host: dfgdfg-wecampmysql-c6zsle
  Port: 3306
  User: root
  Database: wecamp_marketplace
✅ Database connection established successfully
🚀 Server is running on port 3000 in production mode
📡 API endpoint: http://localhost:3000/api
🏥 Health check: http://localhost:3000/health
```

## Şimdi Yapın

1. **Backend Loglarını Kontrol Edin** → Dokploy → Backend Container → Logs
2. **Hata mesajını paylaşın** → "BACKEND LOGLAR: [log mesajları]"
3. **VEYA Backend Container'ı Restart Edin** → Dokploy → Backend Container → Restart

