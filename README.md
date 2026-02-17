# DIY MARTA-style Train Board (GitHub Pages)

This repository is a starter static website for a Raspberry Pi kiosk display.

## Files

- `index.html`: full-screen board display page.
- `board-data.json`: editable board data source.
- `admin.html`: helper page that generates JSON for board updates.
- `styles.css`: display/admin styling.

## Publish on GitHub Pages

1. Push this repo to GitHub.
2. Open **Settings → Pages**.
3. Set **Source** to `Deploy from a branch`.
4. Choose `main` branch and `/ (root)`.
5. Save and wait for the Pages URL.

Your live URL will look like:

- `https://<username>.github.io/<repo>/`

## Update board content

1. Open `/admin.html` in your browser.
2. Edit values and click **Copy JSON**.
3. Open `board-data.json` in GitHub web editor.
4. Paste JSON and commit.
5. The kiosk page refreshes every 30s.

## Raspberry Pi kiosk setup

Install Chromium and autostart in kiosk mode:

```bash
sudo apt update
sudo apt install -y chromium-browser
mkdir -p ~/.config/lxsession/LXDE-pi
cat >> ~/.config/lxsession/LXDE-pi/autostart <<'AUTOSTART'
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --kiosk --incognito https://<username>.github.io/<repo>/
AUTOSTART
```
