# Tide
 Tide client area theme for FOSSBilling

## How to install

1. Clone the repository, or download the latest version
2. Extract and move the tide directory into `FOSSBilling directory`/themes
3. Change directory owner to the user your webserver is running under. F.ex: `chown -Rf www-data:www-data tide/`
4. Set permissions to 750 using chmod `chmod -Rf 750 tide/`

## How to upgrade

1. Clone the repository, or download the latest version
2. Backup to another location `FOSSBilling directory`/themes/tide/config/settings_data.json and any custom assets that you have uploaded at `FOSSBilling directory`/themes/tide/assets
3. Extract and move the tide directory into `FOSSBilling directory`/themes, overwrite everything.
4. Copy back your version of `FOSSBilling directory`/themes/tide/config/settings_data.json and any custom assets that you have uploaded at `FOSSBilling directory`/themes/tide/assets
5. Change directory owner to the user your webserver is running under. F.ex: `chown -Rf www-data:www-data tide/`
6. Set permissions to 750 using chmod `chmod -Rf 750 tide/`
