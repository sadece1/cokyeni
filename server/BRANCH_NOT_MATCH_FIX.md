# Branch Not Match Hatası Çözümü

## Hata
```
{"message":"Branch Not Match"}
```

**Endpoint:** `http://31.97.216.176:3000/api/deploy/q6R_Qz8bhnYE-HODA0Gt0`

Bu, Dokploy'un **deployment webhook** endpoint'i.

## Neden Oluşur?

Dokploy'da ayarlanan **branch** ile GitHub'daki **branch** uyuşmuyor.

## Çözüm

### 1. Dokploy'da Branch Ayarlarını Kontrol Edin

Dokploy → **Projects** → **DFGDFG** → **Backend Container** (veya Frontend Container) → **Settings** veya **General**:

**Kontrol edin:**
- **Branch:** Hangi branch seçili?
- **Repository:** `github.com/sadece1/yenii` doğru mu?

### 2. GitHub Repository'deki Branch'i Kontrol Edin

GitHub → `github.com/sadece1/yenii` → **Branches**:
- Hangi branch aktif? (`main` mi, `master` mi?)
- Default branch nedir?

### 3. Dokploy'da Branch'i Düzeltin

Dokploy → **Backend Container** → **Settings** veya **General**:
- **Branch** dropdown'dan **doğru branch'i seçin** (muhtemelen `main`)
- **Save** yapın

### 4. Frontend Container İçin de Kontrol Edin

Dokploy → **Frontend Container** → **Settings** veya **General**:
- **Branch** ayarını kontrol edin
- **Save** yapın

## Örnek Ayarlar

**Doğru:**
- Repository: `github.com/sadece1/yenii`
- Branch: `main` (veya `master` - GitHub'daki aktif branch)

**Yanlış:**
- Branch: `master` (ama GitHub'da `main` aktif)
- Branch: `main` (ama GitHub'da `master` aktif)

## Hızlı Çözüm

1. **GitHub'da aktif branch'i kontrol edin** → `github.com/sadece1/yenii` → Branches
2. **Dokploy'da branch'i düzeltin** → Backend Container → Settings → Branch → Doğru branch'i seçin
3. **Save yapın**
4. **Container'ı redeploy edin** (gerekirse)

## Not

Bu hata **Bad Gateway** ile ilgili değil. Bu, Dokploy'un deployment mekanizmasıyla ilgili bir sorun.

Bad Gateway hatası için **Backend Container → Logs** kontrol edin.

## Şimdi Yapın

1. **GitHub'da aktif branch'i kontrol edin** → `github.com/sadece1/yenii` → Branches
2. **Dokploy'da branch ayarını kontrol edin** → Backend Container → Settings → Branch
3. **Branch'i düzeltin** → Doğru branch'i seçin → Save
4. **Container'ı redeploy edin** (gerekirse)

"BRANCH DUZELTTIM" yazın, sonra Bad Gateway hatasını kontrol edelim.

