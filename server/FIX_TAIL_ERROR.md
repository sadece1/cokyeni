# Tail Error Çözümü

## Hata
```
tail error: tail: inotify cannot be used, reverting to polling: Too many open files
```

## Çözüm 1: Dokploy Server'da File Descriptor Limiti Artırma (Önerilen)

### Adımlar:

1. **Dokploy Server'a SSH ile bağlanın**
   ```bash
   ssh root@31.97.216.176
   ```

2. **Mevcut limiti kontrol edin**
   ```bash
   ulimit -n
   ```

3. **Geçici olarak limiti artırın** (mevcut session için)
   ```bash
   ulimit -n 65536
   ```

4. **Kalıcı olarak limiti artırın**
   ```bash
   # /etc/security/limits.conf dosyasını düzenleyin
   nano /etc/security/limits.conf
   ```

   Şu satırları ekleyin:
   ```
   * soft nofile 65536
   * hard nofile 65536
   root soft nofile 65536
   root hard nofile 65536
   ```

5. **Dokploy servisini restart edin**
   ```bash
   # Dokploy'u restart edin (Dokploy'un servis adını kontrol edin)
   systemctl restart dokploy
   # VEYA Docker Compose kullanıyorsanız:
   docker-compose restart
   ```

## Çözüm 2: Container Log Dosyalarını Temizleme

Dokploy server'da gereksiz log dosyalarını temizleyin:

```bash
# Docker log dosyalarını temizle
docker system prune -f

# Eski container loglarını temizle
find /var/lib/docker/containers/ -name "*-json.log" -type f -delete
```

## Çözüm 3: Dokploy Container'ını Restart

Dokploy'un kendisini restart edin:

```bash
# Dokploy container'ını bulun ve restart edin
docker ps | grep dokploy
docker restart <dokploy-container-id>
```

## Çözüm 4: Dokploy Ayarlarını Optimize Etme

Dokploy'un log takip ayarlarını optimize edin (Dokploy config dosyasında):

```yaml
# Dokploy config dosyasında (varsa)
log:
  max_files: 100
  max_size: 10MB
```

## En Hızlı Çözüm

**Dokploy Server'a SSH ile bağlanın ve şunu çalıştırın:**

```bash
ulimit -n 65536
```

Bu geçici bir çözümdür. Kalıcı için `/etc/security/limits.conf` dosyasını düzenleyin.

## Not

Bu hata **kritik değil**. Container'lar çalışıyor, uygulama çalışıyor. Sadece log takibi yavaş olabilir.

Ancak hatayı çözmek istiyorsanız, yukarıdaki çözümleri deneyin.

