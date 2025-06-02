const html = await loadHtml("html/tray.html");

class ScreensaverTray extends TrayIconProcess {
  constructor(handler, pid, parentPid, data) {
    super(handler, pid, parentPid, data);
  }

  async renderPopup() {
    const body = this.getPopupBody();
    body.innerHTML = html;

    const delay = body.querySelector("#screensaverDelay");
    const toggle = body.querySelector("#enableScreensaverSwitch");
    /** @type {AppProcess} */
    const target = this.handler.getProcess(this.targetPid);
    const preferences = target.userPreferences().appPreferences.IzK_Screensaver;
    const initialToggleState = preferences.enable ?? true;
    const initialDelayState = Number(preferences.delay) || 30;

    delay.value = initialDelayState;
    toggle.checked = initialToggleState;

    toggle.addEventListener("change", () => {
      target.userPreferences.update((v) => {
        v.appPreferences.IzK_Screensaver.enable = toggle.checked;

        return v;
      });
    });

    delay.addEventListener("input", () => {
      target.userPreferences.update((v) => {
        v.appPreferences.IzK_Screensaver.delay = delay.value;

        return v;
      });
    });
  }
}

return { ScreensaverTray };
