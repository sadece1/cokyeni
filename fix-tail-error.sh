#!/bin/bash

# Tail Error Çözüm Scripti
# Dokploy Server'da çalıştırın

echo "=== Tail Error Çözümü ==="

# 1. Mevcut limiti kontrol et
echo "Mevcut file descriptor limiti:"
ulimit -n

# 2. Geçici olarak limiti artır
echo "File descriptor limitini 65536'ya artırılıyor..."
ulimit -n 65536

# 3. Yeni limiti kontrol et
echo "Yeni file descriptor limiti:"
ulimit -n

# 4. limits.conf dosyasını kontrol et
echo ""
echo "limits.conf dosyası kontrol ediliyor..."
if grep -q "nofile" /etc/security/limits.conf; then
    echo "limits.conf dosyasında nofile ayarı mevcut."
else
    echo "limits.conf dosyasına nofile ayarı ekleniyor..."
    echo "" >> /etc/security/limits.conf
    echo "# Dokploy file descriptor limit" >> /etc/security/limits.conf
    echo "* soft nofile 65536" >> /etc/security/limits.conf
    echo "* hard nofile 65536" >> /etc/security/limits.conf
    echo "root soft nofile 65536" >> /etc/security/limits.conf
    echo "root hard nofile 65536" >> /etc/security/limits.conf
    echo "limits.conf dosyası güncellendi. Lütfen server'ı restart edin."
fi

# 5. Docker log dosyalarını temizle
echo ""
echo "Docker log dosyaları temizleniyor..."
docker system prune -f

echo ""
echo "=== Tamamlandı ==="
echo "Not: Kalıcı değişiklikler için server'ı restart edin."

