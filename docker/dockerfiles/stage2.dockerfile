FROM registry.rdeid.unil.ch/pt-frontend-stage1:latest AS build

COPY . .
# TODO: make a common step with stage1 to avoid reinstalling twice
RUN pnpm install --frozen-lockfile
RUN pnpm build


FROM nginx:alpine AS deploy
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/out /usr/share/nginx/html
COPY --from=build /app/docker/entrypoint.sh /entrypoint.sh
RUN chmod -R 755 /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/entrypoint.sh"]
