const html = await loadHtml("html/body.html");

/** @type {{ ScreensaverTray: TrayIconProcess }} */
const { ScreensaverTray } = await load("js/tray.js");

class proc extends ThirdPartyAppProcess {
  EVENTS = [
    "click",
    "keydown",
    "keyup",
    "keypress",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "drag",
    "focus",
  ];

  constructor(handler, pid, parentPid, app, workingDirectory) {
    super(handler, pid, parentPid, app, workingDirectory);
  }

  async start() {
    if (await this.closeIfSecondInstance()) return false;
  }

  async render() {
    this.win = this.getWindow();
    this.win.style.display = "none";

    this.body = this.getBody();
    this.body.innerHTML = html;

    this.image = this.body.querySelector("#logo");
    this.image.setAttribute("data-arc-keep", true);
    this.image.src = icons.ReleaseLogo;

    this.icon = await this.fs.direct(
      util.join(workingDirectory, "img/icon.svg")
    );

    this.tray = this.shell.trayHost.createTrayIcon(
      this.pid,
      "IzK_ScreensaverTray",
      {
        icon: this.icon,
        popup: {
          width: 200,
          height: 55,
        },
      },
      ScreensaverTray
    );

    const preferences = this.userPreferences().appPreferences.IzK_Screensaver;
    let previousToggleState = preferences.enable;
    let previousDelayState = Number(preferences.delay);

    this.userPreferences.subscribe((v) => {
      if (this._disposed) return;

      if (previousToggleState !== v.appPreferences.IzK_Screensaver.enable) {
        previousToggleState = v.appPreferences.IzK_Screensaver.enable;

        this.win.classList.toggle(
          "screensaver-disabled",
          !v.appPreferences.IzK_Screensaver.enable
        );
        this.timer();
      } else if (
        previousDelayState !== v.appPreferences.IzK_Screensaver.delay
      ) {
        previousDelayState = v.appPreferences.IzK_Screensaver.delay;
        this.timer();
      }
    });

    this.checkStartup();
    this.listen();
    this.startRandomPositionCycle();
  }

  listen() {
    this.Log("Listening");

    if (this._disposed) return;

    for (const event of this.EVENTS) {
      document.addEventListener(event, () => this.timer());
    }

    this.timer();
  }

  timer() {
    if (this._disposed) return;

    clearTimeout(this.timeout);

    this.win.classList.remove("active");

    this.timeout = setTimeout(() => {
      this.Log("Blanking");
      this.lockscreen();
      this.win.classList.add("active");
    }, this.getDelay()); // 30 seconds
  }

  getDelay() {
    return (
      (Number(this.userPreferences().appPreferences.IzK_Screensaver.delay) ||
        30) * 1000
    );
  }

  startRandomPositionCycle() {
    this.interval = setInterval(() => this.repositionImage(), 3000);

    this.repositionImage();
  }

  async onClose() {
    clearInterval(this.interval);
    clearTimeout(this.timeout);

    for (const event of this.EVENTS) {
      document.removeEventListener(event, () => this.timer());
    }

    return true;
  }

  repositionImage() {
    if (this._disposed) return;

    const rect = this.win.getBoundingClientRect();

    let x = Math.floor(Math.random() * rect.width);
    let y = Math.floor(Math.random() * rect.height);

    if (x < 20) x = 20;
    if (x > rect.width - 170) x = rect.width - 170;
    if (y < 20) y = 20;
    if (y > rect.height - 170) y = rect.height - 170;

    this.image.style.top = `${y}px`;
    this.image.style.left = `${x}px`;
  }

  checkStartup() {
    if (this.userPreferences().startup["IzK_Screensaver"] === "app") return;

    MessageBox(
      {
        title: "Add to startup?",
        message:
          "The screensaver app isn't added to your ArcOS startup items. Do you want to start the Screensaver automatically when you log in?",
        sound: "arcos.dialog.warning",
        image: this.icon,
        buttons: [
          { caption: "No", action: () => {} },
          {
            caption: "Yes",
            action: () => {
              this.userPreferences.update((v) => {
                v.startup["IzK_Screensaver"] = "app";
                return v;
              });
            },
            suggested: true,
          },
        ],
      },
      +env.get("shell_pid"),
      true
    );
  }

  lockscreen() {
    const screenlocker = this.handler.getProcess(
      +env.get("izk_screenlocker_pid")
    );

    if (!this.userDaemon?._elevating) screenlocker?.show();
  }
}

return { proc };
