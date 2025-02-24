#!/bin/sh

set -e

echo 'window.__APP_CONFIG__ = {API_URL: "'$API_URL'"};' > /usr/share/nginx/html/config.js

REQUIRED_VARS="PRIMARY_COLOR SECONDARY_COLOR HEADER_BG_COLOR FOOTER_BG_COLOR"
MISSING_VARS=""

for var in $REQUIRED_VARS; do
    eval value=\$$var
    if [ -z "$value" ]; then
        echo "Warning: Environment variable $var is not set."
        MISSING_VARS="$MISSING_VARS $var"
    fi
done

if [ -z "$MISSING_VARS" ]; then
    sed \
        -e "s#\${PRIMARY_COLOR}#${PRIMARY_COLOR}#g" \
        -e "s#\${SECONDARY_COLOR}#${SECONDARY_COLOR}#g" \
        -e "s#\${HEADER_BG_COLOR}#${HEADER_BG_COLOR}#g" \
        -e "s#\${FOOTER_BG_COLOR}#${FOOTER_BG_COLOR}#g" \
        /usr/share/nginx/html/css/pt-theme.css.template > /usr/share/nginx/html/css/pt-theme.css
else
    echo "Warning: Skipping pt-theme.css generation due to missing environment variables."
fi

nginx -g "daemon off;"
