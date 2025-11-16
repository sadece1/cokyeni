# MySQL Container Adı Düzeltme

## Durum

İki farklı MySQL container adı görünüyor:
1. `wecamp-mysql` (muhtemelen eski/yanlış)
2. `dfgdfg-wecampmysql-c6zsle` (muhtemelen doğru - Dokploy'un oluşturduğu tam ad)

## Sorun

Backend'in `DB_HOST` environment variable'ı **yanlış container adını** kullanıyor olabilir.

Dokploy'da container'lar birbirine **container adı** ile bağlanır. Backend'in MySQL'e bağlanabilmesi için `DB_HOST` değeri **tam container adı** olmalı.

## Çözüm

### 1. Doğru MySQL Container Adını Bulun

Dokploy → **Projects** → **DFGDFG** → Container listesini kontrol edin:
- MySQL container'ın **tam adını** bulun
- Muhtemelen: `dfgdfg-wecampmysql-c6zsle`

### 2. Backend Environment Variable'ını Düzeltin

Dokploy → **Backend Container** → **Environment** → `DB_HOST` değerini kontrol edin:

**Yanlış:**
```
DB_HOST=wecamp-mysql
```

**Doğru:**
```
DB_HOST=dfgdfg-wecampmysql-c6zsle
```

### 3. Backend Container'ı Restart Edin

Dokploy → **Backend Container** → **Restart**

## Backend Environment Variables Kontrol Listesi

Dokploy → Backend Container → Environment → Şunların hepsi olmalı:

```
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
DB_HOST=dfgdfg-wecampmysql-c6zsle
DB_PORT=3306
DB_USER=root
DB_PASSWORD=R96f5Lh9-fPGZPY
DB_NAME=wecamp_marketplace
JWT_SECRET=8f1c98386cbceb36513c71e649ad8e4b4c59031f1b903d523ce391f847c1de1ee3a12a9cfcf07f333314a6077afe58547fb1959036805b93ecc6a335379fa89f
JWT_REFRESH_SECRET=78b587a9440466aaade007213284f59b973dbc30e2eed99a13aa91731efe488b0b0ef0f32a6f8b948dbd8871b9f96c2763cf37d4d21755ab940094c5b2b5b4ba
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://wecamp.com.tr
ALLOWED_ORIGINS=https://wecamp.com.tr,https://www.wecamp.com.tr
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
UPLOAD_DIR=/app/uploads
MAX_USER_UPLOAD_QUOTA=1073741824
MAX_UPLOADS_PER_HOUR=50
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ENABLE_CSRF=false
ENABLE_VIRUS_SCAN=false
REQUIRE_VIRUS_SCAN=false
HTTPS_ENFORCE=true
MAX_JSON_SIZE=1mb
MAX_URLENCODED_SIZE=1mb
```

## Önemli

`DB_HOST` değeri **MySQL container'ın tam adı** olmalı:
- ✅ `dfgdfg-wecampmysql-c6zsle` (Dokploy'un oluşturduğu tam ad)
- ❌ `wecamp-mysql` (muhtemelen yanlış)

## Şimdi Yapın

1. **MySQL container adını kontrol edin** → Dokploy → Projects → DFGDFG → Container listesi
2. **Backend DB_HOST değerini düzeltin** → Dokploy → Backend Container → Environment → `DB_HOST=dfgdfg-wecampmysql-c6zsle`
3. **Backend container'ı restart edin** → Dokploy → Backend Container → Restart
4. **Logları kontrol edin** → Backend Container → Logs → Database connection başarılı mı?

"DB_HOST DUZELTTIM, RESTART YAPTIM" yazın, sonra logları kontrol edelim.

