# Backend Logları Kontrolü

## ✅ MySQL Çalışıyor

MySQL loglarında:
- ✅ `ready for connections` - MySQL çalışıyor
- ⚠️ InnoDB lock hataları (kritik değil)

## ❌ Backend Node.js Başlamıyor

Bad Gateway hatası → Backend Node.js başlamamış.

## Backend Loglarını Kontrol Edin

Dokploy → **Backend Container** → **Logs**

**Aranacaklar:**

### 1. Container Başlangıç Mesajları
```
=== CONTAINER STARTING ===
Current directory: /app
Files in /app:
Files in /app/dist:
Starting NGINX...
NGINX started successfully (PID: X)
Starting Node.js server...
Running: node /app/dist/server.js
```

### 2. Node.js Başlangıç Mesajları
```
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
Files in dist:
```

**Çözüm:** Backend container'ı **redeploy** edin (build başarısız olmuş)

#### Hata 2: Database Connection Failed
```
❌ Database connection attempt 1/5 failed: ...
❌ Database connection failed after all retries
```

**Çözüm:** 
- MySQL container çalışıyor mu? ✅ (loglarda görünüyor)
- `DB_HOST` doğru mu? → `dfgdfg-wecampmysql-c6zsle` ✅

#### Hata 3: Environment Validation Failed
```
❌ Environment validation failed: Missing required environment variables
```

**Çözüm:** Backend environment variables'ları kontrol edin

#### Hata 4: Script Çalışmıyor
Eğer loglarda sadece NGINX logları varsa ve `=== CONTAINER STARTING ===` mesajı yoksa:
- `start.sh` script'i çalışmıyor olabilir
- Backend container'ı **redeploy** edin

## Şimdi Yapın

1. ✅ **Dokploy → Backend Container → Logs** → Tüm logları kontrol edin
2. ✅ **Hata mesajı var mı?** → Varsa paylaşın
3. ✅ **VEYA Backend Container → Deploy** (redeploy) → Sonra logları kontrol edin

**"BACKEND LOGLAR: [log mesajları]"** yazın, hatayı birlikte çözelim.

