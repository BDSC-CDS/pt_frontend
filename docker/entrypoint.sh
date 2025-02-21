# echo '{"apiUrl": "' $API_URL '"}' > /usr/share/nginx/html/config.json
echo 'window.__APP_CONFIG__ = {API_URL: "'$API_URL'"};' > /usr/share/nginx/html/config.js

# Copy the logo & CSS theme files
cp -f /usr/share/nginx/html/$LOGO_FILE_NAME /usr/share/nginx/html/pt-logo.png
cp -f /usr/share/nginx/html/css/$CSS_THEME.css /usr/share/nginx/html/css/pt-theme.css

# Start Nginx
nginx -g  "daemon off;"