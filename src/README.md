# ArcMac Screensaver

A screensaver utility designed for the ArcOS iMac. I've decided to make it available to all ArcOS users by removing the electron restrictions. To use this application, simply open it, and configure it in the system tray; you can set the time it takes for the screensaver to activate when you're inactive, and whether or not you want to have it activated. Batteries not included.

This application pairs wonderfully with the ArcMac LockScreen, which is another app I wrote for the iMac to allow for screen locking.

## Startup items

If you want to add this to your startup when using both the screensaver and lockscreen, be sure to add the lockscreen first, and then the screensaver. If the order is flipped, the screensaver will render below the lockscreen, making it uneffective. So, the order should be this:

- IzK_ScreenLocker - App
- IzK_Screensaver - App

## Known problems

- Setting the screensaver to a very low delay can make it quite hard to turn off. If you're unable to turn off the screensaver, restart ArcOS and press F8 on the boot screen (without pressing any other key or clicking the page). This will activate Safe Mode. From there, disable the screensaver from Settings, and then restart.

## Author

Izaak Kuipers [izaak.kuipers@gmail.com](mailto:izaak.kuipers@gmail.com)

## License

MIT
