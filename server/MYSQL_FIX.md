# MySQL Hatalarını Çözme Rehberi

## Mevcut Durum
MySQL çalışıyor ancak şu uyarılar var:
- `Unable to lock ./ibdata1 error: 11` - InnoDB lock uyarısı
- `CA certificate ca.pem is self signed` - Self-signed sertifika uyarısı
- `Insecure configuration for --pid-file` - PID dosyası güvenlik uyarısı

## Çözüm 1: Environment Variables (Zaten Eklendi ✅)
Dokploy → MySQL Container → Environment:
- `MYSQL_INNODB_USE_NATIVE_AIO=0` ✅
- `MYSQL_INNODB_FLUSH_LOG_AT_TRX_COMMIT=2` ✅
- `MYSQL_INNODB_FLUSH_METHOD=O_DIRECT` ✅
- `MYSQL_SKIP_INNODB_LOCK_CHECK=1` ✅

## Çözüm 2: Custom Config Dosyası (Opsiyonel)
`server/mysql-custom.cnf` dosyası oluşturuldu.

Dokploy'da MySQL container'a volume mount ekleyin:
- **Volume Path:** `/etc/mysql/conf.d/custom.cnf`
- **Mount Path:** `mysql-custom.cnf` dosyasının içeriği

**VEYA** MySQL container'ı restart edin - environment variables yeterli olmalı.

## Önemli Not
Bu uyarılar MySQL'in çalışmasını engellemez. MySQL "ready for connections" durumunda.

## Kontrol
Backend loglarında şunu görmelisiniz:
```
📊 Database Configuration:
  Host: dfgdfg-wecampmysql-c6zsle
  Port: 3306
  User: root
  Database: wecamp_marketplace
✅ Database connection established successfully
```

