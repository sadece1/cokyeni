# Backend Node.js Başlamıyor - Çözüm

## Sorun

- ✅ NGINX çalışıyor (loglarda görünüyor)
- ❌ Node.js backend başlamamış (loglarda görünmüyor)
- ❌ Bad Gateway hatası

## Neden

Backend loglarında sadece NGINX logları var, `start.sh` script'inin çıktıları görünmüyor. Bu, şu anlama gelebilir:

1. `start.sh` script'i çalışmıyor
2. Script çalışıyor ama çıktılar görünmüyor
3. Node.js başlarken hata veriyor ama loglar görünmüyor

## Çözüm

### 1. Backend Container'ı Redeploy Edin

`start.sh` script'i güncellendi. Backend container'ı **redeploy** edin:

Dokploy → **Backend Container** → **Deploy** veya **Redeploy**

### 2. Backend Loglarını Kontrol Edin

Redeploy sonrası logları kontrol edin:

**Beklenen loglar:**
```
=== CONTAINER STARTING ===
Current directory: /app
Files in /app:
Files in /app/dist:
Starting NGINX...
NGINX started successfully (PID: X)
Starting Node.js server...
Running: node /app/dist/server.js
✅ Environment variables validated
📊 Database Configuration:
  Host: dfgdfg-wecampmysql-c6zsle
  Port: 3306
  User: root
  Database: wecamp_marketplace
✅ Database connection established successfully
🚀 Server is running on port 3000 in production mode
```

### 3. Olası Hatalar

#### Hata 1: server.js Not Found
```
ERROR: /app/dist/server.js not found!
```

**Çözüm:** Backend build başarısız olmuş, backend'i yeniden build edin

#### Hata 2: Database Connection Failed
```
❌ Database connection failed
```

**Çözüm:** MySQL container çalışıyor mu? `DB_HOST` doğru mu?

#### Hata 3: Environment Validation Failed
```
❌ Environment validation failed
```

**Çözüm:** Backend environment variables'ları kontrol edin

## Şimdi Yapın

1. ✅ **Backend Container → Deploy** (redeploy)
2. ✅ **Backend Container → Logs** → Tüm logları kontrol edin
3. ✅ **Hata mesajı var mı?** → Varsa paylaşın

"REDEPLOY YAPTIM, LOGLAR: [log mesajları]" yazın.

