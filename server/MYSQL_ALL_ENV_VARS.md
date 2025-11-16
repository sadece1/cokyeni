# MySQL Container - Tüm Environment Variables

## Dokploy → MySQL Container → Environment

Aşağıdaki tüm environment variables'ları **tek seferde** ekleyin:

```
MYSQL_ROOT_PASSWORD=R96f5Lh9-fPGZPY
MYSQL_DATABASE=wecamp_marketplace
MYSQL_USER=root
MYSQL_PASSWORD=R96f5Lh9-fPGZPY
MYSQL_INNODB_USE_NATIVE_AIO=0
MYSQL_INNODB_FLUSH_LOG_AT_TRX_COMMIT=2
MYSQL_INNODB_FLUSH_METHOD=O_DIRECT
MYSQL_SKIP_INNODB_LOCK_CHECK=1
MYSQL_INNODB_FILE_PER_TABLE=1
MYSQL_INNODB_BUFFER_POOL_SIZE=128M
MYSQL_SKIP_NAME_RESOLVE=1
MYSQL_MAX_CONNECTIONS=200
MYSQL_MAX_ALLOWED_PACKET=64M
MYSQL_LOG_ERROR_VERBOSITY=1
MYSQL_SKIP_SSL=1
MYSQL_LOG_LEVEL=ERROR
```

## Açıklamalar

### Temel Ayarlar
- `MYSQL_ROOT_PASSWORD`: Root kullanıcı şifresi
- `MYSQL_DATABASE`: Oluşturulacak veritabanı adı
- `MYSQL_USER`: Oluşturulacak kullanıcı adı
- `MYSQL_PASSWORD`: Kullanıcı şifresi

### InnoDB Optimizasyonları
- `MYSQL_INNODB_USE_NATIVE_AIO=0`: Native AIO'yu devre dışı bırak (Docker için)
- `MYSQL_INNODB_FLUSH_LOG_AT_TRX_COMMIT=2`: Performans optimizasyonu
- `MYSQL_INNODB_FLUSH_METHOD=O_DIRECT`: Direct I/O kullan
- `MYSQL_SKIP_INNODB_LOCK_CHECK=1`: InnoDB lock kontrolünü atla
- `MYSQL_INNODB_FILE_PER_TABLE=1`: Her tablo için ayrı dosya
- `MYSQL_INNODB_BUFFER_POOL_SIZE=128M`: Buffer pool boyutu

### Performans Ayarları
- `MYSQL_SKIP_NAME_RESOLVE=1`: DNS çözümlemesini atla
- `MYSQL_MAX_CONNECTIONS=200`: Maksimum bağlantı sayısı
- `MYSQL_MAX_ALLOWED_PACKET=64M`: Maksimum paket boyutu

### Log ve SSL Ayarları
- `MYSQL_LOG_ERROR_VERBOSITY=1`: Log seviyesi
- `MYSQL_SKIP_SSL=1`: SSL'i devre dışı bırak
- `MYSQL_LOG_LEVEL=ERROR`: Sadece ERROR seviyesindeki mesajları göster

## Kopyala-Yapıştır Formatı

Dokploy'da her satırı ayrı ayrı ekleyin:

**Key:** `MYSQL_ROOT_PASSWORD` **Value:** `R96f5Lh9-fPGZPY`
**Key:** `MYSQL_DATABASE` **Value:** `wecamp_marketplace`
**Key:** `MYSQL_USER` **Value:** `root`
**Key:** `MYSQL_PASSWORD` **Value:** `R96f5Lh9-fPGZPY`
**Key:** `MYSQL_INNODB_USE_NATIVE_AIO` **Value:** `0`
**Key:** `MYSQL_INNODB_FLUSH_LOG_AT_TRX_COMMIT` **Value:** `2`
**Key:** `MYSQL_INNODB_FLUSH_METHOD` **Value:** `O_DIRECT`
**Key:** `MYSQL_SKIP_INNODB_LOCK_CHECK` **Value:** `1`
**Key:** `MYSQL_INNODB_FILE_PER_TABLE` **Value:** `1`
**Key:** `MYSQL_INNODB_BUFFER_POOL_SIZE` **Value:** `128M`
**Key:** `MYSQL_SKIP_NAME_RESOLVE` **Value:** `1`
**Key:** `MYSQL_MAX_CONNECTIONS` **Value:** `200`
**Key:** `MYSQL_MAX_ALLOWED_PACKET` **Value:** `64M`
**Key:** `MYSQL_LOG_ERROR_VERBOSITY` **Value:** `1`
**Key:** `MYSQL_SKIP_SSL` **Value:** `1`
**Key:** `MYSQL_LOG_LEVEL` **Value:** `ERROR`

## Sonraki Adımlar

1. ✅ Tüm environment variables'ları ekleyin
2. ✅ Save yapın
3. ✅ MySQL Container → Restart
4. ✅ Logları kontrol edin

