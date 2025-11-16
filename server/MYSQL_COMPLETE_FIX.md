# MySQL Hatalarını Tamamen Çözme Rehberi

## MySQL Container Ayarları

### 1. Environment Variables (Dokploy → MySQL Container → Environment)

**Temel Ayarlar:**
```
MYSQL_ROOT_PASSWORD=R96f5Lh9-fPGZPY
MYSQL_DATABASE=wecamp_marketplace
MYSQL_USER=root
MYSQL_PASSWORD=R96f5Lh9-fPGZPY
```

**InnoDB Optimizasyonları:**
```
MYSQL_INNODB_USE_NATIVE_AIO=0
MYSQL_INNODB_FLUSH_LOG_AT_TRX_COMMIT=2
MYSQL_INNODB_FLUSH_METHOD=O_DIRECT
MYSQL_SKIP_INNODB_LOCK_CHECK=1
```

**Ek Optimizasyonlar (Uyarıları Kaldırmak İçin):**
```
MYSQL_INNODB_FILE_PER_TABLE=1
MYSQL_SKIP_NAME_RESOLVE=1
MYSQL_MAX_CONNECTIONS=200
MYSQL_MAX_ALLOWED_PACKET=64M
```

### 2. Volume Mount (Opsiyonel - Daha İyi Kontrol İçin)

Dokploy → MySQL Container → Volumes:
- **Volume Name:** `mysql-config` (yeni volume oluştur)
- **Mount Path:** `/etc/mysql/conf.d/custom.cnf`
- **Content:** `server/mysql-custom.cnf` dosyasının içeriği

**VEYA** daha basit: Environment variables yeterli olmalı.

### 3. MySQL Container Restart

Tüm environment variables eklendikten sonra:
- Dokploy → MySQL Container → Restart

## Beklenen Sonuç

MySQL loglarında sadece şunları görmelisiniz:
```
[Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
[Note] [Entrypoint]: Switching to dedicated user 'mysql'
[System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections.
```

**HATA veya UYARI olmamalı!**

