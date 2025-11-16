# Coolify SSH Bağlantı Hatası Çözümü

## Hata Mesajı
```
İzin reddedildi (publickey,password)
```

Bu hata, SSH authentication'ın başarısız olduğunu gösterir.

## Çözüm Adımları

### 1. SSH Bilgilerini Kontrol Edin

#### Hostinger hPanel'den SSH Bilgilerini Alın:

1. **hPanel'e giriş yapın**
2. **VPS** bölümüne gidin
3. VPS'inizi seçin (`srv1074962.hstgr.cloud`)
4. **SSH Access** veya **Server Details** bölümüne gidin
5. Şunları kontrol edin:
   - ✅ SSH Username (genellikle `root`)
   - ✅ SSH Password (güvenli bir yerde saklanmış olmalı)
   - ✅ SSH Port (genellikle `22`)

### 2. Manuel SSH Testi Yapın

Coolify'dan önce, bilgisayarınızdan manuel SSH bağlantısını test edin:

#### Windows'ta (PowerShell veya CMD):
```bash
ssh root@31.97.216.176
```

#### Mac/Linux'ta:
```bash
ssh root@31.97.216.176
```

**Eğer manuel SSH çalışıyorsa:**
- Coolify'da aynı bilgileri kullanın
- Password'ü doğru girdiğinizden emin olun

**Eğer manuel SSH çalışmıyorsa:**
- SSH bilgilerini Hostinger'dan tekrar alın
- VPS'in çalıştığını kontrol edin

### 3. SSH Password'ü Sıfırlama (Gerekirse)

Eğer SSH password'ünü unuttuysanız veya bilmiyorsanız:

#### Hostinger hPanel'den:
1. **VPS** → VPS'inizi seçin
2. **SSH Access** bölümüne gidin
3. **"Reset SSH Password"** veya **"Change Password"** butonuna tıklayın
4. Yeni password oluşturun
5. Password'ü güvenli bir yerde saklayın

### 4. SSH Key Kullanımı (Alternatif - Önerilen)

SSH Key kullanmak daha güvenlidir:

#### SSH Key Oluşturma (Windows'ta):
```bash
# PowerShell'de
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

Key dosyaları:
- Public key: `C:\Users\YourUsername\.ssh\id_rsa.pub`
- Private key: `C:\Users\YourUsername\.ssh\id_rsa`

#### Public Key'i VPS'e Ekleme:

**Yöntem 1: Hostinger hPanel'den**
1. hPanel → VPS → SSH Access
2. "Add SSH Key" veya "Manage SSH Keys"
3. Public key içeriğini yapıştırın

**Yöntem 2: Manuel (Password ile bağlanabiliyorsanız)**
```bash
# VPS'e bağlanın
ssh root@31.97.216.176

# Public key'i ekleyin
mkdir -p ~/.ssh
echo "your-public-key-content" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

#### Coolify'da SSH Key Kullanma:
1. Coolify formunda **"SSH Key"** seçeneğini seçin
2. Private key içeriğini yapıştırın (`id_rsa` dosyasının içeriği)
3. "Validate Connection" butonuna tıklayın

### 5. Coolify Form Ayarları

#### Password Kullanıyorsanız:
```
Server Name: hostinger-vps
IP Address: 31.97.216.176
SSH Port: 22
SSH User: root
Authentication: Password
Password: [Hostinger'dan aldığınız password]
```

#### SSH Key Kullanıyorsanız:
```
Server Name: hostinger-vps
IP Address: 31.97.216.176
SSH Port: 22
SSH User: root
Authentication: SSH Key
Private Key: [id_rsa dosyasının içeriği]
```

### 6. Hostinger Özel Durumlar

#### VPS Yeni Kurulduysa:
- İlk kurulum e-postasını kontrol edin
- SSH bilgileri e-postada olabilir

#### VPS'te SSH Disabled Olabilir:
1. hPanel → VPS → Server Details
2. SSH'nin aktif olduğundan emin olun
3. Gerekirse SSH'yi aktifleştirin

#### Firewall Sorunu:
1. hPanel → VPS → Firewall
2. Port 22'nin açık olduğundan emin olun
3. Gerekirse port 22'yi açın

### 7. Alternatif: Hostinger Support

Eğer yukarıdaki adımlar işe yaramazsa:
1. Hostinger Support'a başvurun
2. SSH bilgilerinizi isteyin
3. VPS'in SSH erişimini kontrol ettirin

## Adım Adım Kontrol Listesi

- [ ] Hostinger hPanel'den SSH password'ü aldım
- [ ] Manuel SSH testi yaptım (`ssh root@31.97.216.176`)
- [ ] Manuel SSH çalışıyor mu? (Evet/Hayır)
- [ ] Coolify'da aynı password'ü kullandım
- [ ] SSH Port 22 doğru mu?
- [ ] SSH User `root` doğru mu?
- [ ] Firewall'da port 22 açık mı?
- [ ] VPS çalışıyor mu? (Hostinger panelinde kontrol)

## Hızlı Test Komutları

### Windows PowerShell:
```powershell
# SSH bağlantı testi
ssh root@31.97.216.176

# Ping testi
Test-Connection 31.97.216.176

# Port kontrolü (PowerShell 7+)
Test-NetConnection -ComputerName 31.97.216.176 -Port 22
```

### Mac/Linux:
```bash
# SSH bağlantı testi
ssh root@31.97.216.176

# Ping testi
ping 31.97.216.176

# Port kontrolü
nc -zv 31.97.216.176 22
```

## Başarılı Bağlantı Sonrası

✅ SSH bağlantısı başarılı olduğunda:
1. Coolify agent kurulumu başlar
2. 5-10 dakika sürebilir
3. İlerlemeyi takip edin
4. Kurulum tamamlandığında application oluşturabilirsiniz

## Önemli Notlar

1. **Password Güvenliği**: SSH password'ünüzü kimseyle paylaşmayın
2. **SSH Key**: Production için SSH key kullanmak daha güvenlidir
3. **Firewall**: Port 22'nin açık olduğundan emin olun
4. **VPS Durumu**: VPS'in çalışır durumda olduğundan emin olun

## Destek

Sorun devam ederse:
1. Hostinger Support'a başvurun
2. Coolify community forum'una bakın
3. SSH hata loglarını kontrol edin

