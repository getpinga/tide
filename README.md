# Tide Theme for FOSSBilling

## Overview

Tide is a client area theme for FOSSBilling. It's designed to enhance your user interface with a clean, modern aesthetic. This guide provides steps on how to install, upgrade, secure, and customize the Tide theme.

<img width="735" alt="tide_screen" src="https://github.com/getpinga/Tide/assets/121483313/433bf991-6bc0-4c11-83ba-7a369f88ae1a">

## Installation

Follow these steps to install the Tide theme:

1. Clone this repository or download the latest version.
2. Extract the files and move the `tide` directory into the `FOSSBilling directory/themes`.
3. Change the directory owner to the user your web server runs under. For example: `chown -Rf www-data:www-data tide/`.
4. Set permissions to `750` using chmod: `chmod -Rf 750 tide/`.
5. Navigate to `Settings -> Themes` in the FOSSBilling admin panel and select `tide` as the default theme.

## Upgrade

To upgrade to a newer version of the Tide theme, perform the following:

1. Clone this repository or download the latest version.
2. Backup your `FOSSBilling directory/themes/tide/config/settings_data.json` and any custom assets located at `FOSSBilling directory/themes/tide/assets`. Pay close attention if you have customized the CSS file at `FOSSBilling directory/themes/tide/assets/css/custom.css`.
3. Extract the latest version and move the `tide` directory into `FOSSBilling directory/themes`, overwriting all files.
4. Restore your `settings_data.json` and any custom assets from the backup.
5. Change the directory owner to the web server user. For example: `chown -Rf www-data:www-data tide/`.
6. Set permissions to `750` using chmod: `chmod -Rf 750 tide/`.

## Security Measures for Prior Installations (Before 0.9.5)

For versions of Tide installed prior to 0.9.5, implement these security measures:

1. Change the directory owner to the web server user. For example: `chown -Rf www-data:www-data tide/`.
2. Set permissions to `750` using chmod: `chmod -Rf 750 tide/`.

## Theme Customization

Tide now allows you to replace default colours with custom ones, enabling you to align the theme with your branding. To make these changes, edit the `FOSSBilling directory/themes/tide/assets/css/custom.css` file as per the comments provided within it.

Please remember to regularly update your theme to receive the latest enhancements and security patches. Enjoy using Tide!
