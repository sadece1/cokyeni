# Branch Not Match - Tek Branch Durumu

## Durum

- GitHub'da **1 branch var** (muhtemelen `main`)
- Dokploy'da da aynı branch seçili olmalı
- Ama hala "Branch Not Match" hatası alınıyor

## Olası Nedenler

### 1. Dokploy'da Branch Ayarı Eksik/Yanlış
Dokploy'da branch ayarı boş veya yanlış yazılmış olabilir.

**Kontrol:** Dokploy → Backend Container → Settings → Branch
- Branch adı: `main` (tam olarak, küçük harfle)
- Boşluk olmamalı
- Büyük/küçük harf duyarlı

### 2. Webhook Ayarları
GitHub webhook'u yanlış branch'e gönderiyor olabilir.

**Kontrol:** GitHub → Repository → Settings → Webhooks
- Webhook'un hangi branch'e gönderdiğini kontrol edin

### 3. Dokploy Repository URL
Repository URL yanlış olabilir.

**Kontrol:** Dokploy → Backend Container → Settings → Repository
- Repository: `github.com/sadece1/yenii` (`.git` olmadan)
- VEYA: `https://github.com/sadece1/yenii.git`

## Çözüm

### 1. Dokploy'da Branch Ayarını Kontrol Edin

Dokploy → **Backend Container** → **Settings** veya **General**:
- **Branch:** `main` (tam olarak, küçük harfle)
- **Save** yapın

### 2. Frontend Container İçin de Kontrol Edin

Dokploy → **Frontend Container** → **Settings** veya **General**:
- **Branch:** `main` (tam olarak, küçük harfle)
- **Save** yapın

### 3. Container'ı Redeploy Edin

Dokploy → **Backend Container** → **Deploy** veya **Redeploy**

## Önemli Not

**Branch Not Match** hatası **Bad Gateway** ile ilgili değil!

Bad Gateway hatası için **Backend Container → Logs** kontrol edin.

## Şimdi Yapın

1. **Dokploy → Backend Container → Settings → Branch** → `main` yazın (küçük harfle)
2. **Save** yapın
3. **Backend Container → Deploy** (gerekirse)
4. **Backend Container → Logs** kontrol edin → Bad Gateway hatası için

"BRANCH DUZELTTIM" veya "BACKEND LOGLAR: [log mesajları]" yazın.

